
import Products from "./Products";
import "../assets/style.css"
// import './style.css'

export default function HomePage(props) {
  return (
    <Products API_URL={props.API_URL}/>
  );
}
