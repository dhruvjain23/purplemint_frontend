export default function Navbar() {
    return (
        <div className="bg-green-600 text-white p-4 flex justify-between items-center">
            <div className="text-[2rem] font-bold">GreenCart Logistics</div>
            <button
                className="bg-white text-green-600 px-4 py-1 rounded"
                onClick={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/";
                }}
            >
                Logout
            </button>
        </div>
    );
}
