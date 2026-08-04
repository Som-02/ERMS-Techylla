import { Link } from "react-router-dom";
import "./pageHeader.css";

const PageHeader = ({
    title,
    subtitle = "",
    buttonText,
    buttonLink,
    secondaryButtonText,
    onSecondaryClick,
    thirdButtonText,
    onThirdClick,
}) => {

    return (

        <div className="page-header">

            <div className="page-title">

                <h1>{title}</h1>

                {subtitle && <p>{subtitle}</p>}

            </div>
            <div className="header-actions">
{thirdButtonText && (

        <button
            className="secondary-btn"
            onClick={onThirdClick}
        >

            {thirdButtonText}

        </button>

    )}
    {secondaryButtonText && (
        <button
            className="secondary-btn"
            onClick={onSecondaryClick}
        >
            {secondaryButtonText}
        </button>
    )}

    {buttonText && (
        <Link
            to={buttonLink}
            className="page-btn"
        >
            + {buttonText}
        </Link>
    )}

</div>

        </div>

    );

};

export default PageHeader;