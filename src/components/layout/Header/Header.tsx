"use client";

import { ChangeEvent, useEffect, useMemo, useState, type FC } from "react";

import Link from "next/link";
import Image from "next/image";

import { Button, Container, Input, HeaderLogout } from "@/components/index";

import { Value } from "@/types/input";

import { NavPaths } from "@/enums/navPaths";

import { IsRegistered, UserName } from "@/types/header";

import styles from "./Header.module.scss";

export const Header: FC = () => {
  const [inputValue, setInputValue] = useState<Value>("");
  const [userName, setUserName] = useState<UserName>(null);
  const [isRegistered, setIsRegistered] = useState<IsRegistered>(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const updateUserData = () => {
    const sortedData = localStorage.getItem("registration");
    if (sortedData) {
      try {
        const parsedData = JSON.parse(sortedData);
        if (parsedData && parsedData.email) {
          setUserName(parsedData.email || null);
          setIsRegistered(true);
        }
      } catch {
        console.error("Failed to parse registration data from localStorage.");
      }
    } else {
      setUserName(null);
      setIsRegistered(false);
    }
  };

  useEffect(() => {
    updateUserData();

    const handleStorageChange = () => {
      updateUserData();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const validateUserName = useMemo(() => {
    if (userName) {
      const namePart = userName.split("@")[0];
      const [firstName, lastName] = namePart
        .split(".")
        .map((part: string) => part.replace(/\d+/g, "").trim());
      return [firstName, lastName]
        .filter(Boolean)
        .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
        .join(" ");
    }
    return null;
  }, [userName]);

  return (
    <header className={styles["header"]}>
      <div className={styles["headerContainer"]}>
        <Input
          icon="/icons/outlined-icons/search.svg"
          onChange={handleInputChange}
          value={inputValue}
          htmlFor="search"
          label=""
          id="search"
          type="search"
          name="search"
          placeholder="Search..."
          classNames={{
            input: styles["headerSearchInput"],
            container: styles["headerSearchContainer"],
            label: styles["headerSearchLabel"],
          }}
        />
        <Container className={styles["headerButtonsContainer"]}>
          <Button
            type="button"
            className={styles["headerNotification"]}
            title="Your Notification"
          >
            <Image
              src="/icons/outlined-icons/notification.svg"
              alt="Notification Icon"
              width={24}
              height={24}
            />
          </Button>
          {!isRegistered && (
            <Button type="button" className={styles["headerSignInButton"]}>
              <Link href={NavPaths.SIGN_IN}>
                <Image
                  src="/icons/outlined-icons/add-user.svg"
                  alt="Notification Icon"
                  width={24}
                  height={24}
                />
              </Link>
            </Button>
          )}
          {isRegistered && <HeaderLogout validateUserName={validateUserName} />}
        </Container>
      </div>
    </header>
  );
};
