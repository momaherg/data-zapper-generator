import React, { useState } from "react";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { Textarea } from "@/components/ui/textarea"; // Import the correct Textarea component
import { ChevronRight } from "lucide-react";

export interface DetailGroupProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const DetailGroup: React.FC<DetailGroupProps> = ({ title, children, defaultOpen = true }) => {
  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <div className="border border-secondary rounded-md overflow-hidden">
          <DisclosureButton className="flex w-full items-center justify-between bg-secondary/5 px-4 py-2 text-sm font-medium text-primary">
            <span>{title}</span>
            <ChevronRight
              className={`${
                open ? "rotate-90 transform" : ""
              } h-4 w-4 text-primary/60`}
            />
          </DisclosureButton>
          <DisclosurePanel className="p-4 bg-card">{children}</DisclosurePanel>
        </div>
      )}
    </Disclosure>
  );
};

export default DetailGroup;
