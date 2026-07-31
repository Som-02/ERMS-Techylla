import { forwardRef } from "react";

const Select = forwardRef(
    (
        {
            label,
            options = [],
            error,
            ...props
        },
        ref
    ) => {
        return (
            <div>

                {label && (
                    <label>
                        {label}
                    </label>
                )}

                <select
                    ref={ref}
                    {...props}
                >

                    <option value="">
                        Select
                    </option>

                    {options.map((option) => (

                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>

                    ))}

                </select>

                {error && (
                    <p>{error}</p>
                )}

            </div>
        );
    }
);

Select.displayName = "Select";

export default Select;