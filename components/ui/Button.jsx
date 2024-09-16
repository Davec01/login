export function Button({ children, className, ...props }) {
  return (
    <button className={`py-2 px-4 font-semibold rounded-lg shadow-md ${className}`} {...props}>
      {children}
    </button>
  );
}
