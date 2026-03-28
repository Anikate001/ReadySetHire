"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

const FormSchema = z.object({
  email: z
    .string({
      required_error: "Please select a type of interview.",
    }),
})

export function SelectForm({ createMeeting }: {createMeeting: (type?: string) => void}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {

    createMeeting(`${data.email}`);

    toast({
      title: "Creating a mock interview session", 
      // `You submitted the following values: ${data.email}`
      // description: (
      //   <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
      //     <code className="text-white">{JSON.stringify(data, null, 2)}</code>
      //   </pre>
      // ),
      
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Email</FormLabel> */}
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="focus-visible:ring-0 focus-visible:ring-offset-0 text-white">
                    <SelectValue placeholder="Select an interview topic" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-dark-2 border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-white">
                  <SelectItem className="hover:bg-dark-4 transition-all " value="dsa">DSA</SelectItem>
                  <SelectItem className="hover:bg-dark-4 transition-all" value="webdev">Web Dev</SelectItem>
                  <SelectItem className="hover:bg-dark-4 transition-all" value="consulting">Consulting</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                You will be recommended questions related to the topic you select.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center">
          <Button
            type="submit"
            className="bg-blue-1 focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            Join Meeting
          </Button>
        </div>
      </form>
    </Form>
  )
}
