// "use client";

// import { useEffect, useState } from "react";


// import { DeleteModal } from "@/components/modals/delete-modal";

// export const ModalProvider = ()=>{
//     const [isMounted, setIsmounted] = useState(false);

//     useEffect(()=>{
//         setIsmounted(true);
//     },[]);

//     if (!isMounted) return null;

//     return(
//         <>
//         <DeleteModal />
//         </>
//     );

// };