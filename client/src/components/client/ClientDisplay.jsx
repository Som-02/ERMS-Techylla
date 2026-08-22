const ClientDisplay = ({
    client,
    logoOnly = false,
    showNameAlways = false,
}) => {
    if (!client) {
        return <span className="client-display-fallback">-</span>;
    }

    const clientName =
        typeof client === "string"
            ? client
            : client?.name || "";

    const logo =
        typeof client === "object"
            ? client?.logo
            : "";

    // If no logo is present, always fallback to text name
    if (!logo) {
        return (
            <span className="client-display-name">
                {clientName || "-"}
            </span>
        );
    }

    // Logo only mode (for Project table & Dashboard)
    if (logoOnly && !showNameAlways) {
        return (
            <div className="client-logo-wrapper" title={clientName}>
                <img
                    src={logo}
                    alt={`${clientName || "Client"} logo`}
                    className="client-display-logo-img"
                />
            </div>
        );
    }

    // Logo + name together (for Client page, Client details, etc.)
    return (
        <div className="client-display">
            <div className="client-logo-wrapper" title={clientName}>
                <img
                    src={logo}
                    alt={`${clientName || "Client"} logo`}
                    className="client-display-logo-img"
                />
            </div>

            <span className="client-display-name">
                {clientName || "-"}
            </span>
        </div>
    );
};

export default ClientDisplay;