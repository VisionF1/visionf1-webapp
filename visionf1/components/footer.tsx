import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer>
      <Separator className="m-4 mb-6" />
      <div className="mx-auto max-w-4xl px-4 pb-6 text-center text-[0.7rem] text-sidebar-ring leading-relaxed">
        <p className="mb-2">© 2025 VisionF1. All rights reserved.</p>

        <p >
          This website is an independent, unofficial student project and is not affiliated in any way with the Formula 1 group of companies, the FIA, or any related entity. F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX, and other related trademarks are registered trademarks of Formula One Licensing B.V.
        </p>
      </div>
    </footer>
  )
}