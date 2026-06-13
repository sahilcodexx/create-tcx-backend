import { IconBrandGithub, IconDownload } from "@tabler/icons-react";

export default function Home() {
  return (
    <div className="h-screen w-full  flex items-center justify-center">
      <div className="max-w-sm w-full">
        <div className="flex items-center justify-between">
          <div className="font-mono">v1.0.0 </div>
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-1">
              <IconDownload size={14} />
              24
            </div>
            <div className="flex items-center gap-1 ">
              <IconBrandGithub size={14} /> 50
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
