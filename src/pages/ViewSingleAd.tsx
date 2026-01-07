import { useParams } from "react-router-dom";
import ViewAddComponent from "../componnts/ViewAddComponent";
import NavBar from "../componnts/NavBar";
import Footer from "../componnts/Footer";

export default function ViewAddPage() {
  const { id } = useParams<{ id: string }>(); 

  if (!id) {
    return <p>Invalid Ad ID</p>; 
  }

  return (
    <>
      <NavBar />
      <ViewAddComponent adId={id} />
      <Footer />
    </>
  );
}
