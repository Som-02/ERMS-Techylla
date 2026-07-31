const StatCard = ({ title, value }) => {

    return (

        <div className="border rounded-lg shadow p-5 bg-white w-64">

            <h3 className="text-gray-500 text-sm">
                {title}
            </h3>

            <h1 className="text-3xl font-bold mt-2">
                {value}
            </h1>

        </div>

    );

};

export default StatCard;