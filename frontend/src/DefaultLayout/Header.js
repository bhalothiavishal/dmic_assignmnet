
function Header({ title }) {
  return (
    <div className="row mt-2">
      <div className="col-md-6 text-left pl-45"> <h2>Dminc </h2> </div>
      <div className="col-md-6 text-left"> <h2>{title} </h2> </div>
    </div>
  );
}

export default Header;