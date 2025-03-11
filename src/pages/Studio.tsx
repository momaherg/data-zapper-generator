import * as React from "react";
import TeamManager from "../components/studio/manager";

// markup
const StudioPage = ({ data }: any) => {
  return (
      <main style={{ height: "100%" }} className=" h-full ">
        <TeamManager />
      </main>
  );
};


export default StudioPage;
