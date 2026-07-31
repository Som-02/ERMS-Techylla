import "./searchBar.css";

const SearchBar = ({
    value,
    onChange,
    placeholder = "Search by employee name, email or ID..."
}) => {

    return (

        <div className="search-wrapper">

            <input
                className="search-input"
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />

        </div>

    );

};

export default SearchBar;