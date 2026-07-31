import { Link } from "react-router-dom";

const ClientRow = ({
    client,
    onDelete,
}) => {

    return (

        <tr>

            <td>{client.name}</td>

            <td>

                <Link
                    to={`/clients/${client._id}`}
                >
                    View
                </Link>

                {" | "}

                <Link
                    to={`/clients/edit/${client._id}`}
                >
                    Edit
                </Link>

                {" | "}

                <button
                    onClick={() =>
                        onDelete(client)
                    }
                >
                    Delete
                </button>

            </td>

        </tr>

    );

};

export default ClientRow;