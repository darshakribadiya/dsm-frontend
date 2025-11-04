import { GalleryVerticalEnd } from "lucide-react";

import { LoginForm } from "@/components/login-form";
import AspectImg from "@/components/Aspect-img";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Do Nothing Just Code...
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:flex justify-center items-center">
        <AspectImg src="/logo.svg" alt="Image" classname={"size-40"} />
      </div>
    </div>
  );
}
