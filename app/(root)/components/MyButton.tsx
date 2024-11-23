interface ButtonProps {
    text: string;
    onClick: () => void;
  }
  
export function MyButton({ text, onClick }: ButtonProps) {
    return (
      <button
        className="bg-white hover:bg-gray-300 shadow-lg text-black font-bold py-1 px-4 rounded-lg"
        onClick={onClick}
      >
        {text}
      </button>
    );
}