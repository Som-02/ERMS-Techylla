import useAuth from "../../hooks/useAuth";

const Navbar = () => {
    const { user } = useAuth();

    return (
        <header className="navbar">

    <h2>
        Human Resource Management System
    </h2>

    <div>

        Welcome,&nbsp;

        <strong>
            {user?.name}
        </strong>

    </div>

</header>
    );
};

export default Navbar;