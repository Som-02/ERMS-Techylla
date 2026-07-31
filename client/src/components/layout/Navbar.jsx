import useAuth from "../../hooks/useAuth";

const Navbar = () => {
    const { admin } = useAuth();

    return (
        <header className="navbar">

    <h2>
        Employee Resource Management
    </h2>

    <div>

        Welcome,&nbsp;

        <strong>
            {admin?.name}
        </strong>

    </div>

</header>
    );
};

export default Navbar;