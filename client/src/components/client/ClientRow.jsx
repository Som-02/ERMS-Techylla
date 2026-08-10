import { Link } from "react-router-dom";
import {
    Eye,
    Pencil,
    Trash2,
} from "lucide-react";
import "./client.css"
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
                        className="client-btn client-view-btn"
                    >
                        <Eye size={18} />
                    </Link>

                    <Link
                        to={`/clients/edit/${client._id}`}
                        className="client-btn client-edit-btn"
                    >
                        <Pencil size={18} />
                    </Link>

                    <button className="client-btn delete-btn"onClick={() =>onDelete(client)}><Trash2 size={18} /></button>
                </div>
            </td>
        </tr>
    );
};

export default ClientRow;