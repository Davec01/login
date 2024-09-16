// components/ui/Dialog.jsx
export function Dialog({ children }) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {children}
        </div>
      </div>
    );
  }
  
  export function DialogContent({ children }) {
    return <div className="mt-4">{children}</div>;
  }
  
  export function DialogHeader({ children }) {
    return <div className="font-bold text-lg">{children}</div>;
  }
  
  export function DialogTitle({ children }) {
    return <h2 className="text-xl font-semibold">{children}</h2>;
  }
  
  export function DialogDescription({ children }) {
    return <p className="text-gray-700">{children}</p>;
  }
  
  export function DialogFooter({ children }) {
    return <div className="mt-4">{children}</div>;
  }
  