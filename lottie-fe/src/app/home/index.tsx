import { Outlet, NavLink } from "react-router-dom";
import ThemeSwitcher from "./themeSwitcher";

const getNavClassName = ({ isActive }: { isActive: boolean }) => {
  const base = "appearance-none dark:text-slate-400";
  const activeDarkNav = `${base} dark:text-white`;
  return isActive ? activeDarkNav : base;
};

const Home = (): JSX.Element => {
  return (
    <div className="w-screen h-screen">
      <div className="p-8">
        <div className="w-full flex flex-row flex-wrap gap-4 justify-items-center">
          <NavLink to="/animations" className={getNavClassName}>
            Animations
          </NavLink>
          {/* <NavLink to="/resumes" className={getNavClassName}> */}
          {/*   Resumes */}
          {/* </NavLink> */}
          <div className="flex-1 flex justify-end">
            <ThemeSwitcher />
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
