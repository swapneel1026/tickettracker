"use client";
import { Button, Flex, Select } from "@radix-ui/themes";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function TicketActionBar() {
  const router = useRouter();
  const searchParams = useSearchParams().get("status");
  const status = ["OPEN", "CLOSED", "IN_PROGRESS"];

  return (
    <Flex justify={"between"}>
      <Select.Root
        defaultValue={
          typeof searchParams === "string" && status?.includes(searchParams)
            ? searchParams
            : "All"
        }
        onValueChange={(status) => {
          const query = status !== "All" ? `?status=${status}` : "";
          router.push(`tickets${query}`);
        }}
      >
        <Select.Trigger placeholder="Sort by Status" />
        <Select.Content>
          <Select.Group>
            <Select.Item value={"All"}>All</Select.Item>
            <Select.Item value={"OPEN"}>Open</Select.Item>
            <Select.Item value={"CLOSED"}>Closed</Select.Item>
            <Select.Item value="IN_PROGRESS">In Progress</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <Button onClick={(e) => e.preventDefault()}>
        <Link href={"/tickets/new"}>Add new Ticket</Link>
      </Button>
    </Flex>
  );
}
