export default async function Drivers() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl">
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl">
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl">
        </div>
      </div>
      <div className="bg-muted/50 aspect-video min-h-min flex-1 rounded-xl md:min-h-min">
      </div>
      <div className="bg-muted/50 aspect-video min-h-min flex-1 rounded-xl md:min-h-min">
      </div>
    </div>
  );
}
