import ClientRow from "./ClientRow";
import "./client.css";

const ClientTable = ({
    clients,
    onDelete,
}) => {

    return (
        <div className="client-table-wrapper">
            <table className="client-table">
                <thead>
                    <tr>
                        <th>Client</th>
                        <th style={{width:"270px"}}>Actions</th>
                    </tr>
                </thead>
                <tbody>

                    {
                        clients.length===0 ? (
                            <tr>
                                <td
                                    colSpan="2"
                                    style={{
                                        textAlign:"center",
                                        padding:"40px",
                                        color:"#6b7280"
                                    }}
                                >
                                    No Clients Found
                                </td>
                            </tr>
                        ) : (

                            clients.map(client=>(
                                <ClientRow
                                    key={client._id}
                                    client={client}
                                    onDelete={onDelete}
                                />
                            ))
                        )
                    }
                </tbody>
            </table>
        </div>
    );
};
export default ClientTable;