import React, { createContext, useEffect, useState } from "react";
import { auth, usersRef } from "../config/firebase";
import { onSnapshot, doc } from "firebase/firestore";

export const AvatarContext = createContext();

export const AvatarProvider = ({ children }) => {
  const [avatars, setAvatars] = useState({});

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userDoc = doc(usersRef, user.uid);
    const unsubscribe = onSnapshot(userDoc, (docSnap) => {
      const data = docSnap.data();
      setAvatars(data?.avatars || {});
    });

    return unsubscribe;
  }, []);

  return (
    <AvatarContext.Provider value={{ avatars }}>
      {children}
    </AvatarContext.Provider>
  );
};
