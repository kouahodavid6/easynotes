// components/Toast/AppToaster.jsx
import { Toaster } from "react-hot-toast";
import { CheckCircle, XCircle } from "lucide-react";

const AppToaster = ({ 
    position = "top-right", 
    duration = 4000 
}) => {
    return (
        <Toaster
            position={position}
            toastOptions={{
                duration,
                style: {
                    background: "#f5f3ff",
                    color: "#4c1d95",
                    border: "1px solid #c4b5fd",
                    padding: "12px 16px",
                    fontWeight: "500",
                    fontSize: "14px",
                },
                success: {
                    icon: <CheckCircle className="text-[#166534] w-5 h-5" />,
                    style: {
                        background: "#bbf7d0",
                        color: "#166534",
                        borderColor: "#4ade80",
                    },
                },
                error: {
                    icon: <XCircle className="text-[#7f1d1d] w-5 h-5" />,
                    style: {
                        background: "#fee2e2",
                        color: "#7f1d1d",
                        borderColor: "#fca5a5",
                    },
                },
            }}
        />
    );
};

export default AppToaster