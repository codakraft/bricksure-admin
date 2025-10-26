import { Routes, Route } from "react-router-dom";
import { ChargesList } from "./components/ChargesList";
import { ChargeDetail } from "./components/ChargeDetail";
import { CreateCharge } from "./components/CreateCharge";

export function ChargesManagement() {
  return (
    <Routes>
      <Route index element={<ChargesList />} />
      <Route path="/create" element={<CreateCharge />} />
      <Route path="/:id" element={<ChargeDetail />} />
    </Routes>
  );
}
