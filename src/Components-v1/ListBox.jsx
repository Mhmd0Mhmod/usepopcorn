import { useState } from "react";
import ButtonToggle from "./ButtonToggle";

function ListBox({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <ButtonToggle isOpen={isOpen} setIsOpen={setIsOpen} />
      {isOpen && children}
    </div>
  );
}

export default ListBox;
