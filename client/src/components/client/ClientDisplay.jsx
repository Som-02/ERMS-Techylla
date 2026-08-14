const ClientDisplay = ({
    client,
    logoOnly = false,
}) => {

    if (!client) {
        return "-";
    }

    const clientName =
        typeof client === "string"
            ? client
            : client.name;

    const logo =
        typeof client === "object"
            ? client.logo
            : "";

    // No logo → always show name
    if (!logo) {
        return (
            <span className="client-display-name">
                {clientName || "-"}
            </span>
        );
    }

    // Logo only → used later in Project table / Dashboard
    if (logoOnly) {
        return (
            <img
                src={logo}
                alt={`${clientName || "Client"} logo`}
                className="client-display-logo-only"
                title={clientName}
            />
        );
    }

    // Logo + name → Client page / Employee details / Employee portal
    return (
        <div className="client-display">

            <img
                src={logo}
                alt={`${clientName || "Client"} logo`}
                className="client-display-logo"
            />

            <span className="client-display-name">
                {clientName || "-"}
            </span>

        </div>
    );
};

export default ClientDisplay;