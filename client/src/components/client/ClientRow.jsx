import { Link } from "react-router-dom";

const ClientRow = ({
    client,
    onDelete,
}) => {
    return (
        <tr>
            <td className="client-name">{client.name}</td>
            <td>
                <div className="client-actions">
                    <Link
                        to={`/clients/${client._id}`}
                        className="client-btn view-btn"
                    >
                        View
                    </Link>

                    <Link
                        to={`/clients/edit/${client._id}`}
                        className="client-btn edit-btn"
                    >
                        Edit
                    </Link>

                    <button className="client-btn delete-btn"onClick={() =>onDelete(client)}>Delete</button>
                </div>
            </td>
        </tr>
    );
};

export default ClientRow;