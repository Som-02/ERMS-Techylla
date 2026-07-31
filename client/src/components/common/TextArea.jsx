import { forwardRef } from "react";

const TextArea = forwardRef(
    (
        {
            label,
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

                <textarea
                    ref={ref}
                    {...props}
                />

                {error && (
                    <p>{error}</p>
                )}

            </div>
        );
    }
);

TextArea.displayName = "TextArea";

export default TextArea;