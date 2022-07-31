import { NavLink } from "react-router-dom";

function Nav() {
  return (
    <div className="sidebar col-md-3">
      <ul>
        <NavLink to="/"><li>Home</li></NavLink>
        <NavLink to="/orders"><li>Orders</li></NavLink>       
      </ul>
    </div>
  );
}

export default Nav;