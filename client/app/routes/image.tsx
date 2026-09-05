import { Copy, Download } from "lucide-react"
import type { Route } from "./+types/image";
import { Cloudinary } from "@cloudinary/url-gen";
import { format, quality } from '@cloudinary/url-gen/actions/delivery'
import { auto as qAuto } from '@cloudinary/url-gen/qualifiers/quality'
import { auto as fAuto } from '@cloudinary/url-gen/qualifiers/format'
import { toast } from "sonner";


export async function loader({ params }: Route.LoaderArgs) {
  const cld = new Cloudinary({
    cloud: {
      cloudName: 'dxn8gsdb6'
    }
  });
  const url = cld.image(params.id).delivery(quality(qAuto())).delivery(format(fAuto())).addFlag("attachment").toURL()
  return { url }
}

function Image({
  loaderData
}: Route.ComponentProps) {

  const { url } = loaderData

  async function handleCopy() {
    await navigator.clipboard.writeText(location.href);
    toast.success("Copied to clipboard", { position: "top-center" })
  }

  return (
    <div className="h-screen ">
      <title></title>
      <meta name="description" content={""} />
      <meta property="og:image" content={url} />
      <img src={url} className="h-full w-auto  mx-auto" />
      <div className="absolute top-4 right-6 flex gap-6 items-center">
        <button onClick={handleCopy}><Copy /></button>
        <a href={url} download> <Download /> </a>
      </div>
    </div>
  )
}

export default Image
