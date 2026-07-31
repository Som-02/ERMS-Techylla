import { forwardRef } from "react";

const Input = forwardRef(
    (
        {
            label,
            error,
            type = "text",
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

                <input
                    ref={ref}
                    type={type}
                    {...props}
                />

                {error && (
                    <p>{error}</p>
                )}

            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;