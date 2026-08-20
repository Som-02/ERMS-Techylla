import { useEffect, useRef, useState } from "react";
import { getProjectStatuses } from "../../services/projectService";
import ProjectRow from "./ProjectRow";
import "./project.css";

const ProjectTable = ({
    projects,
    onDelete,
    filters,
    onApplyFilter,
    onClearFilter,
}) => {

    const [openFilter, setOpenFilter] = useState(null);

    const [inputValue, setInputValue] = useState("");

    const [selectedStatuses, setSelectedStatuses] = useState([]);

    const filterRef = useRef(null);

    const [statuses, setStatuses] = useState([]);
    useEffect(() => {

    const loadStatuses = async () => {

        try {

            const res =
                await getProjectStatuses();

            setStatuses(
                (res.data || []).map(
                    status => status.name
                )
            );

        } catch (error) {

            console.error(
                "Failed to load project statuses",
                error
            );

        }

    };

    loadStatuses();

}, []);
    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                filterRef.current &&
                !filterRef.current.contains(event.target)
            ) {

                setOpenFilter(null);

            }

        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);

    const openFilterMenu = (column) => {

        setOpenFilter(
            openFilter === column
                ? null
                : column
        );

        if (
            column === "status"
        ) {

            setSelectedStatuses(
                filters.status || []
            );

        }
        else {

            setInputValue(
                filters[column] || ""
            );

        }

    };

    const applyFilter = (column) => {

        if (column === "status") {

            onApplyFilter(
                column,
                selectedStatuses
            );

        }
        else {

            onApplyFilter(
                column,
                inputValue.trim()
            );

        }

        setOpenFilter(null);

    };

    const clearFilter = (column) => {

        onClearFilter(column);

        setInputValue("");

        setSelectedStatuses([]);

        setOpenFilter(null);

    };

    const toggleStatus = (status) => {

        setSelectedStatuses(prev => {

            if (prev.includes(status)) {

                return prev.filter(
                    item => item !== status
                );

            }

            return [
                ...prev,
                status
            ];

        });

    };

    const renderFilterButton = (column) => {

        const isActive =
            column === "status"
                ? filters.status?.length > 0
                : Boolean(filters[column]);

        return (
            <button
                type="button"
                className={`column-filter-btn ${
                    isActive
                        ? "filter-active"
                        : ""
                }`}
                onClick={() =>
                    openFilterMenu(column)
                }
            >
                ▼
            </button>
        );

    };

    const renderFilterOverlay = (column) => {

        if (openFilter !== column) {

            return null;

        }

        if (column === "status") {

            return (

                <div
                    className="column-filter-overlay status-filter-overlay"
                    ref={filterRef}
                >

                    <div className="status-filter-list">

                        {statuses.map(status => (

                            <label
                                key={status}
                                className="status-filter-option"
                            >

                                <input
                                    type="checkbox"
                                    checked={
                                        selectedStatuses.includes(
                                            status
                                        )
                                    }
                                    onChange={() =>
                                        toggleStatus(status)
                                    }
                                />

                                <span>
                                    {status}
                                </span>

                            </label>

                        ))}

                    </div>

                    <div className="column-filter-actions">

                        <button
                            type="button"
                            className="filter-apply-btn"
                            onClick={() =>
                                applyFilter(column)
                            }
                        >
                            Apply
                        </button>

                        <button
                            type="button"
                            className="filter-clear-btn"
                            onClick={() =>
                                clearFilter(column)
                            }
                        >
                            Clear
                        </button>

                    </div>

                </div>

            );

        }

        return (

            <div
                className="column-filter-overlay"
                ref={filterRef}
            >

                <input
                    type="text"
                    className="column-filter-input"
                    value={inputValue}
                    onChange={(e) =>
                        setInputValue(
                            e.target.value
                        )
                    }
                    onKeyDown={(e) => {

                        if (
                            e.key === "Enter"
                        ) {

                            applyFilter(column);

                        }

                    }}
                    placeholder={
                        column === "name"
                            ? "Enter project name"
                            : column === "client"
                            ? "Enter client name"
                            : "Enter date"
                    }
                    autoFocus
                />

                <div className="column-filter-actions">

                    <button
                        type="button"
                        className="filter-apply-btn"
                        onClick={() =>
                            applyFilter(column)
                        }
                    >
                        Apply
                    </button>

                    <button
                        type="button"
                        className="filter-clear-btn"
                        onClick={() =>
                            clearFilter(column)
                        }
                    >
                        Clear
                    </button>

                </div>

            </div>

        );

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

                        <th>
                            S.No
                        </th>

                        <th className="filterable-header">

                            <div className="header-content">

                                 <span className="header-text">
                                    Project
                                 </span>

                                {renderFilterButton("name")}

                            </div>

                            {renderFilterOverlay("name")}

                        </th>

                        <th className="filterable-header">

                            <div className="header-content">

                                <span className="header-text">
            Client
        </span>

                                {renderFilterButton("client")}

                            </div>

                            {renderFilterOverlay("client")}

                        </th>

                        <th className="filterable-header">

                            <div className="header-content">

                                <span className="header-text">
            Start Date
        </span>

                                {renderFilterButton("startDate")}

                            </div>

                            {renderFilterOverlay("startDate")}

                        </th>

                        <th className="filterable-header">

                            <div className="header-content">

                                <span className="header-text">
            End Date
        </span>

                                {renderFilterButton("endDate")}

                            </div>

                            {renderFilterOverlay("endDate")}

                        </th>

                        <th className="filterable-header">

                            <div className="header-content">

                                <span className="header-text">
            Status
        </span>

                                {renderFilterButton("status")}

                            </div>

                            {renderFilterOverlay("status")}

                        </th>

                        <th>
                            Actions
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {projects.length === 0 ? (

                        <tr>

                            <td
                                colSpan="7"
                                className="empty-table"
                            >
                                No Projects Found
                            </td>

                        </tr>

                    ) : (

                        projects.map(
                            (project, index) => (

                                <ProjectRow
                                    key={project._id}
                                    index={index}
                                    project={project}
                                    onDelete={onDelete}
                                />

                            )
                        )

                    )}

                </tbody>

            </table>
            </div>
        </div>

    );

};

export default ProjectTable;