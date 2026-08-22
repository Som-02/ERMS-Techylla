import { useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { getProjectStatuses } from "../../services/projectService";
import ProjectRow from "./ProjectRow";
import {
    ArrowUpAZ,
    ArrowDownAZ,
    Search,
    Hash,
    FolderKanban,
    Building2,
    Calendar,
    CalendarCheck,
    Activity,
    SlidersHorizontal,
} from "lucide-react";
import "./project.css";

const ProjectTable = ({
    projects,
    onDelete,
    filters,
    onApplyFilter,
    onClearFilter,
}) => {
    const [openFilter, setOpenFilter] = useState(null);
    const [overlayPos, setOverlayPos] = useState({ top: 0, left: 0 });
    const filterRef = useRef(null);
    const buttonRefs = useRef({});

    // Dynamic statuses from API
    const [statuses, setStatuses] = useState([]);

    // Applied Filters state
    const [selectedNames, setSelectedNames] = useState([]);
    const [selectedClients, setSelectedClients] = useState([]);
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [startDateInput, setStartDateInput] = useState("");
    const [endDateInput, setEndDateInput] = useState("");

    // Temporary selections inside active dropdown
    const [tempSelectedNames, setTempSelectedNames] = useState([]);
    const [tempSelectedClients, setTempSelectedClients] = useState([]);
    const [tempSelectedStatuses, setTempSelectedStatuses] = useState([]);

    // Master options lists (never shrinks when table is filtered)
    const [masterProjectNames, setMasterProjectNames] = useState([]);
    const [masterClientNames, setMasterClientNames] = useState([]);

    // Search query inside filter dropdown
    const [searchQuery, setSearchQuery] = useState("");

    // Sorting state: { key: string|null, direction: "asc"|"desc"|null, type: "default"|"year"|"month" }
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: null,
        type: "default",
    });

    useEffect(() => {
        const loadStatuses = async () => {
            try {
                const res = await getProjectStatuses();
                setStatuses((res.data || []).map((status) => status.name));
            } catch (error) {
                console.error("Failed to load project statuses", error);
            }
        };
        loadStatuses();
    }, []);

    // Accumulate master options list from projects so unselected items never vanish
    useEffect(() => {
        if (projects && projects.length > 0) {
            const pNames = projects.map((p) => p.name).filter(Boolean);
            setMasterProjectNames((prev) => {
                const set = new Set([...prev, ...pNames]);
                return [...set].sort((a, b) => a.localeCompare(b));
            });

            const cNames = projects.map((p) => p.client?.name || p.client).filter(Boolean);
            setMasterClientNames((prev) => {
                const set = new Set([...prev, ...cNames]);
                return [...set].sort((a, b) => a.localeCompare(b));
            });
        }
    }, [projects]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                // Check if click was on the trigger button itself
                const isButtonClick = Object.values(buttonRefs.current).some(
                    (btn) => btn && btn.contains(event.target)
                );
                if (!isButtonClick) {
                    setOpenFilter(null);
                }
            }
        };

        const handleScrollOrResize = () => {
            if (openFilter) {
                updateOverlayPos(openFilter);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("scroll", handleScrollOrResize, true);
        window.addEventListener("resize", handleScrollOrResize);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", handleScrollOrResize, true);
            window.removeEventListener("resize", handleScrollOrResize);
        };
    }, [openFilter]);

    const uniqueStatuses = useMemo(() => {
        const list = [...statuses, ...projects.map((p) => p.status).filter(Boolean)];
        return [...new Set(list)].sort((a, b) => a.localeCompare(b));
    }, [statuses, projects]);

    const updateOverlayPos = (column) => {
        const btn = buttonRefs.current[column];
        if (btn) {
            const rect = btn.getBoundingClientRect();
            const left = Math.min(Math.max(10, rect.left), window.innerWidth - 290);
            setOverlayPos({
                top: rect.bottom + 4,
                left: left,
            });
        }
    };

    // Open filter popup & initialize temporary selections
    const openFilterMenu = (column) => {
        if (openFilter === column) {
            setOpenFilter(null);
            return;
        }

        updateOverlayPos(column);
        setSearchQuery("");

        // Initialize temp selections from applied filters or full master list
        if (column === "name") {
            setTempSelectedNames(
                selectedNames.length === 0 ? [...masterProjectNames] : [...selectedNames]
            );
        } else if (column === "client") {
            setTempSelectedClients(
                selectedClients.length === 0 ? [...masterClientNames] : [...selectedClients]
            );
        } else if (column === "status") {
            setTempSelectedStatuses(
                selectedStatuses.length === 0 ? [...uniqueStatuses] : [...selectedStatuses]
            );
        }

        setOpenFilter(column);
    };

    // Filter items inside dropdown based on search input
    const getFilteredOptions = (column) => {
        let list = [];
        if (column === "name") list = masterProjectNames;
        else if (column === "client") list = masterClientNames;
        else if (column === "status") list = uniqueStatuses;

        if (!searchQuery.trim()) return list;

        const q = searchQuery.trim().toLowerCase();
        return list.filter((item) => String(item).toLowerCase().includes(q));
    };

    // Check if item is selected in temp state
    const isItemSelected = (column, item) => {
        if (column === "name") return tempSelectedNames.includes(item);
        if (column === "client") return tempSelectedClients.includes(item);
        if (column === "status") return tempSelectedStatuses.includes(item);
        return false;
    };

    // Select All logic in temp state
    const isAllSelected = (column) => {
        const visibleOptions = getFilteredOptions(column);
        if (visibleOptions.length === 0) return false;
        return visibleOptions.every((opt) => isItemSelected(column, opt));
    };

    const toggleSelectAll = (column) => {
        const visibleOptions = getFilteredOptions(column);
        const allSelected = isAllSelected(column);

        if (column === "name") {
            if (allSelected) {
                setTempSelectedNames((prev) => prev.filter((opt) => !visibleOptions.includes(opt)));
            } else {
                setTempSelectedNames((prev) => [...new Set([...prev, ...visibleOptions])]);
            }
        } else if (column === "client") {
            if (allSelected) {
                setTempSelectedClients((prev) => prev.filter((opt) => !visibleOptions.includes(opt)));
            } else {
                setTempSelectedClients((prev) => [...new Set([...prev, ...visibleOptions])]);
            }
        } else if (column === "status") {
            if (allSelected) {
                setTempSelectedStatuses((prev) => prev.filter((opt) => !visibleOptions.includes(opt)));
            } else {
                setTempSelectedStatuses((prev) => [...new Set([...prev, ...visibleOptions])]);
            }
        }
    };

    const toggleItem = (column, item) => {
        if (column === "name") {
            setTempSelectedNames((prev) =>
                prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
            );
        } else if (column === "client") {
            setTempSelectedClients((prev) =>
                prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
            );
        } else if (column === "status") {
            setTempSelectedStatuses((prev) =>
                prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
            );
        }
    };

    // Apply filter action
    const applyFilter = (column) => {
        if (column === "name") {
            // If all options or 0 options checked -> clear filter (show all)
            if (
                tempSelectedNames.length === masterProjectNames.length ||
                tempSelectedNames.length === 0
            ) {
                setSelectedNames([]);
                onApplyFilter("name", []);
            } else {
                setSelectedNames(tempSelectedNames);
                onApplyFilter("name", tempSelectedNames);
            }
        } else if (column === "client") {
            if (
                tempSelectedClients.length === masterClientNames.length ||
                tempSelectedClients.length === 0
            ) {
                setSelectedClients([]);
                onApplyFilter("client", []);
            } else {
                setSelectedClients(tempSelectedClients);
                onApplyFilter("client", tempSelectedClients);
            }
        } else if (column === "status") {
            if (
                tempSelectedStatuses.length === uniqueStatuses.length ||
                tempSelectedStatuses.length === 0
            ) {
                setSelectedStatuses([]);
                onApplyFilter("status", []);
            } else {
                setSelectedStatuses(tempSelectedStatuses);
                onApplyFilter("status", tempSelectedStatuses);
            }
        } else if (column === "startDate") {
            onApplyFilter("startDate", startDateInput.trim());
        } else if (column === "endDate") {
            onApplyFilter("endDate", endDateInput.trim());
        }
        setOpenFilter(null);
    };

    // Clear filter & reset column sorting
    const clearFilter = (column) => {
        if (column === "name") {
            setSelectedNames([]);
            setTempSelectedNames([]);
        } else if (column === "client") {
            setSelectedClients([]);
            setTempSelectedClients([]);
        } else if (column === "status") {
            setSelectedStatuses([]);
            setTempSelectedStatuses([]);
        } else if (column === "startDate") {
            setStartDateInput("");
        } else if (column === "endDate") {
            setEndDateInput("");
        }

        if (sortConfig.key === column) {
            setSortConfig({ key: null, direction: null, type: "default" });
        }

        onClearFilter(column);
        setSearchQuery("");
        setOpenFilter(null);
    };

    // Handle column sorting
    const handleSort = (column, direction, type = "default") => {
        if (
            sortConfig.key === column &&
            sortConfig.direction === direction &&
            sortConfig.type === type
        ) {
            setSortConfig({ key: null, direction: null, type: "default" });
        } else {
            setSortConfig({ key: column, direction, type });
        }
    };

    // Client-side sorting on projects list
    const processedProjects = useMemo(() => {
        let result = [...projects];

        if (sortConfig.key && sortConfig.direction) {
            const { key, direction, type } = sortConfig;
            const multiplier = direction === "asc" ? 1 : -1;

            result.sort((a, b) => {
                if (key === "startDate" || key === "endDate") {
                    const dateA = a[key] ? new Date(a[key]) : new Date(0);
                    const dateB = b[key] ? new Date(b[key]) : new Date(0);

                    if (type === "year") {
                        const yearA = dateA.getFullYear();
                        const yearB = dateB.getFullYear();
                        if (yearA !== yearB) return (yearA - yearB) * multiplier;
                    } else if (type === "month") {
                        const monthA = dateA.getMonth();
                        const monthB = dateB.getMonth();
                        if (monthA !== monthB) return (monthA - monthB) * multiplier;
                    }

                    return (dateA.getTime() - dateB.getTime()) * multiplier;
                }

                let valA = "";
                let valB = "";

                if (key === "name") {
                    valA = (a.name || "").toLowerCase();
                    valB = (b.name || "").toLowerCase();
                } else if (key === "client") {
                    valA = (a.client?.name || a.client || "").toLowerCase();
                    valB = (b.client?.name || b.client || "").toLowerCase();
                } else if (key === "status") {
                    valA = (a.status || "").toLowerCase();
                    valB = (b.status || "").toLowerCase();
                }

                if (valA < valB) return -1 * multiplier;
                if (valA > valB) return 1 * multiplier;
                return 0;
            });
        }

        return result;
    }, [projects, sortConfig]);

    const renderFilterButton = (column) => {
        const isFiltered =
            (column === "name" && selectedNames.length > 0) ||
            (column === "client" && selectedClients.length > 0) ||
            (column === "status" && selectedStatuses.length > 0) ||
            (column === "startDate" && Boolean(startDateInput)) ||
            (column === "endDate" && Boolean(endDateInput));

        const isSorted = sortConfig.key === column;

        return (
            <button
                ref={(el) => (buttonRefs.current[column] = el)}
                type="button"
                className={`column-filter-btn ${
                    isFiltered || isSorted ? "filter-active" : ""
                }`}
                onClick={() => openFilterMenu(column)}
                title="Filter & Sort"
            >
                {isSorted ? (sortConfig.direction === "asc" ? "▲" : "▼") : "▼"}
            </button>
        );
    };

    const renderFilterOverlay = (column) => {
        if (openFilter !== column) return null;

        const isDateColumn = column === "startDate" || column === "endDate";

        const overlayContent = (
            <div
                className="column-filter-overlay"
                ref={filterRef}
                style={{
                    position: "fixed",
                    top: `${overlayPos.top}px`,
                    left: `${overlayPos.left}px`,
                    zIndex: 99999,
                }}
            >
                {/* 1. SORTING SECTION */}
                <div className="filter-sort-section">
                    {isDateColumn ? (
                        <>
                            <button
                                type="button"
                                className={`sort-option-btn ${
                                    sortConfig.key === column &&
                                    sortConfig.direction === "asc" &&
                                    sortConfig.type === "default"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() => handleSort(column, "asc", "default")}
                            >
                                <ArrowUpAZ size={14} /> Sort Oldest to Newest
                            </button>
                            <button
                                type="button"
                                className={`sort-option-btn ${
                                    sortConfig.key === column &&
                                    sortConfig.direction === "desc" &&
                                    sortConfig.type === "default"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() => handleSort(column, "desc", "default")}
                            >
                                <ArrowDownAZ size={14} /> Sort Newest to Oldest
                            </button>
                            <button
                                type="button"
                                className={`sort-option-btn ${
                                    sortConfig.key === column &&
                                    sortConfig.direction === "asc" &&
                                    sortConfig.type === "year"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() => handleSort(column, "asc", "year")}
                            >
                                📅 Sort Year-wise (Ascending)
                            </button>
                            <button
                                type="button"
                                className={`sort-option-btn ${
                                    sortConfig.key === column &&
                                    sortConfig.direction === "desc" &&
                                    sortConfig.type === "year"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() => handleSort(column, "desc", "year")}
                            >
                                📅 Sort Year-wise (Descending)
                            </button>
                            <button
                                type="button"
                                className={`sort-option-btn ${
                                    sortConfig.key === column &&
                                    sortConfig.direction === "asc" &&
                                    sortConfig.type === "month"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() => handleSort(column, "asc", "month")}
                            >
                                📅 Sort Month-wise (Ascending)
                            </button>
                            <button
                                type="button"
                                className={`sort-option-btn ${
                                    sortConfig.key === column &&
                                    sortConfig.direction === "desc" &&
                                    sortConfig.type === "month"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() => handleSort(column, "desc", "month")}
                            >
                                📅 Sort Month-wise (Descending)
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                className={`sort-option-btn ${
                                    sortConfig.key === column && sortConfig.direction === "asc"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() => handleSort(column, "asc", "default")}
                            >
                                <ArrowUpAZ size={14} /> Sort A to Z
                            </button>
                            <button
                                type="button"
                                className={`sort-option-btn ${
                                    sortConfig.key === column && sortConfig.direction === "desc"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() => handleSort(column, "desc", "default")}
                            >
                                <ArrowDownAZ size={14} /> Sort Z to A
                            </button>
                        </>
                    )}
                </div>

                <hr className="filter-divider" />

                {/* 2. SEARCH BOX */}
                <div className="filter-search-box">
                    <Search size={14} className="filter-search-icon" />
                    <input
                        type="text"
                        className="column-filter-input"
                        value={
                            isDateColumn
                                ? column === "startDate"
                                    ? startDateInput
                                    : endDateInput
                                : searchQuery
                        }
                        onChange={(e) => {
                            if (column === "startDate") {
                                setStartDateInput(e.target.value);
                            } else if (column === "endDate") {
                                setEndDateInput(e.target.value);
                            } else {
                                setSearchQuery(e.target.value);
                            }
                        }}
                        placeholder={
                            isDateColumn ? "Enter date, month or year..." : "Search"
                        }
                        autoFocus
                    />
                </div>

                {/* 3. MULTI-SELECT CHECKBOX LIST (For name, client, status) */}
                {!isDateColumn && (
                    <div className="filter-checklist-wrapper hidden-scrollbar">
                        {/* SELECT ALL */}
                        <label className="filter-checkbox-item select-all-item">
                            <input
                                type="checkbox"
                                checked={isAllSelected(column)}
                                onChange={() => toggleSelectAll(column)}
                            />
                            <span>(Select All)</span>
                        </label>

                        {/* CHECKBOX OPTIONS */}
                        {getFilteredOptions(column).map((item) => (
                            <label key={item} className="filter-checkbox-item">
                                <input
                                    type="checkbox"
                                    checked={isItemSelected(column, item)}
                                    onChange={() => toggleItem(column, item)}
                                />
                                <span>{item}</span>
                            </label>
                        ))}

                        {getFilteredOptions(column).length === 0 && (
                            <div className="no-filter-results">No matches found</div>
                        )}
                    </div>
                )}

                {/* 4. ACTION BUTTONS */}
                <div className="column-filter-actions">
                    <button
                        type="button"
                        className="filter-apply-btn"
                        onClick={() => applyFilter(column)}
                    >
                        Apply
                    </button>
                    <button
                        type="button"
                        className="filter-clear-btn"
                        onClick={() => clearFilter(column)}
                    >
                        Clear
                    </button>
                </div>
            </div>
        );

        return createPortal(overlayContent, document.body);
    };

    return (
        <div className="project-table-wrapper">
            <div className="project-table-scroll">
                <table className="project-table">
                    <colgroup>
                        <col style={{ width: "5%" }} />
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "15%" }} />
                        <col style={{ width: "15%" }} />
                        <col style={{ width: "15%" }} />
                        <col style={{ width: "15%" }} />
                        <col style={{ width: "15%" }} />
                    </colgroup>

                    <thead>
                        <tr>
                            <th>S.No</th>

                            <th className="filterable-header">
                                <div className="header-content">
                                    <span className="header-text">
                                        <FolderKanban size={14} />
                                        <span>Project</span>
                                    </span>
                                    {renderFilterButton("name")}
                                </div>
                                {renderFilterOverlay("name")}
                            </th>

                            <th className="filterable-header">
                                <div className="header-content">
                                    <span className="header-text">
                                        <Building2 size={14} />
                                        <span>Client</span>
                                    </span>
                                    {renderFilterButton("client")}
                                </div>
                                {renderFilterOverlay("client")}
                            </th>

                            <th className="filterable-header">
                                <div className="header-content">
                                    <span className="header-text">
                                        <Calendar size={14} />
                                        <span>Start Date</span>
                                    </span>
                                    {renderFilterButton("startDate")}
                                </div>
                                {renderFilterOverlay("startDate")}
                            </th>

                            <th className="filterable-header">
                                <div className="header-content">
                                    <span className="header-text">
                                        <CalendarCheck size={14} />
                                        <span>End Date</span>
                                    </span>
                                    {renderFilterButton("endDate")}
                                </div>
                                {renderFilterOverlay("endDate")}
                            </th>

                            <th className="filterable-header">
                                <div className="header-content">
                                    <span className="header-text">
                                        <Activity size={14} />
                                        <span>Status</span>
                                    </span>
                                    {renderFilterButton("status")}
                                </div>
                                {renderFilterOverlay("status")}
                            </th>

                            <th style={{ textAlign: "center" }}>
                                <div className="th-content" style={{ justifyContent: "center" }}>
                                    <SlidersHorizontal size={14} />
                                    <span>Actions</span>
                                </div>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {processedProjects.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="empty-table">
                                    No Projects Found
                                </td>
                            </tr>
                        ) : (
                            processedProjects.map((project, index) => (
                                <ProjectRow
                                    key={project._id}
                                    index={index}
                                    project={project}
                                    onDelete={onDelete}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProjectTable;