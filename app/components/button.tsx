interface ButtonProps {
    text: string;
    onClick: () => void;
}

export function Button(
    { text, onClick }: ButtonProps
) {
    return (
        <button
            className="bg-white hover:bg-gray-200 shadow-md text-black font-bold py-1 px-4 rounded-lg"
            onClick={onClick}
        >
            {text}
        </button>
    );
}