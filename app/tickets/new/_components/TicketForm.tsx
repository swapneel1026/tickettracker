"use client";
import { Ticket } from "@prisma/client";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Button, Callout, Link, TextField } from "@radix-ui/themes";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa6";
import SimpleMDE from "react-simplemde-editor";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
// disabling ssr using dynamic from next/dynamic
// const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
//   ssr: false,
// });

interface Props {
  ticket?: Ticket;
}

const NewTicketForm = ({ ticket }: Props) => {
  type FormDetails = {
    title: string;
    description: string;
  };
  const router = useRouter();
  const[inProgress,setProgress]=useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormDetails>();
  const onSubmit = async (data: any) => {
    try {
      if (ticket) {
        setProgress(true)
        await axios.patch(`/api/tickets/${ticket?.id}`, data);
        toast.success("Ticket successfully updated");
      } else {
        setProgress(true)
        await axios.post("/api/tickets", data);
        toast.success("Ticket successfully created");
      }
      router.push("/tickets");
      router.refresh();
    } catch (error) {
      setProgress(false)
      toast.error("Unexpected Error Occured");
    }
  };

  return (
    <>
      {ticket?.status !== "CLOSED" ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" p-4 flex flex-col space-y-3 max-w-[70rem] mx-auto "
        >
          <Button
            className="max-w-fit"
            onClick={(e) => {
              e.preventDefault();
              router.back();
            }}
          >
            <FaArrowLeft width="16" height="16" />
            Back
          </Button>
          <TextField.Root>
            <TextField.Input
              defaultValue={ticket?.title}
              placeholder="Title"
              {...register("title", { required: "Title is required" })}
            />
          </TextField.Root>
          <small className="text-red-500 font-semibold">
            {errors?.title?.message}
          </small>
          <Controller
            name="description"
            rules={{ required: "Description is required" }}
            control={control}
            defaultValue={ticket?.description}
            render={({ field }) => (
              <SimpleMDE placeholder="Description here" {...field} />
            )}
          />
          <small className="text-red-500 font-semibold">
            {errors?.description?.message}
          </small>

          <Button className="max-w-fit" disabled={inProgress}>
            {ticket ? "Update" : "Submit"} New Ticket
            <ClipLoader size={"18px"} color="white" loading={inProgress} />
          </Button>
        </form>
      ) : (
        <Callout.Root>
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text size={"7"}>Ticket has been closed.</Callout.Text>
          <Link href="/tickets" size="1" color="red">
            Take me to tickets section.
          </Link>
        </Callout.Root>
      )}
    </>
  );
};

export default NewTicketForm;

