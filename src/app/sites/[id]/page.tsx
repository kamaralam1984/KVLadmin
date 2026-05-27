import { SiteDetailPage } from "@/modules/sites/SiteDetailPage"

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ tab?: string }> }

export default async function Page({ params, searchParams }: Props) {
  const { id } = await params
  const { tab } = await searchParams
  return <SiteDetailPage siteId={id} initialTab={tab ?? "overview"} />
}
