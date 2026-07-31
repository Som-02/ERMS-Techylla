import ClientRow from "./ClientRow";

const ClientTable = ({
    clients,
    onDelete,
}) => {

    return (

        <table border="1" cellPadding="10" width="100%">

            <thead>

                <tr>

                    <th>Client Name</th>
                    <th>Actions</th>

                </tr>

            </thead>

            <tbody>

                {(clients || []).map((client) => (

                    <ClientRow
                        key={client._id}
                        client={client}
                        onDelete={onDelete}
                    />

                ))}

            </tbody>

        </table>

    );

};

export default ClientTable;