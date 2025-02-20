
import { LogOut, Menu} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Header = ({
  isSidebarCollapsed,
  toggleSidebar,
  isSysAdmin,
}: {
  isSidebarCollapsed: boolean;
  toggleSidebar: React.MouseEventHandler<HTMLButtonElement>;
  isSysAdmin?: boolean;
}) => {

  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token and user data from cookies
    Cookies.remove("token");
    Cookies.remove("user");
    
    // Redirect to login page
    navigate("/");
  };

  return (
    <div
      className={`bg-white transition-all duration-300 w-full border ${
        isSidebarCollapsed ? "" : ""
      } sticky top-0 z-50`}
    >
      <div className="flex items-center justify-between p-4 sticky">
        <div className="flex-grow flex gap-4 items-center">
          {isSysAdmin ? (
            <img  className="w-16 h-16" />
          ) : (
            <>
              <button onClick={toggleSidebar}>
                <Menu />
              </button>
              <div>
                <input placeholder="search" />
              </div>
            </>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center p-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all"
        >
          <LogOut size={20} />
          Logout
        </button>
     
      </div>
    </div>
  );
};

export default Header;
