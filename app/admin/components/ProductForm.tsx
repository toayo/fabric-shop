import CloudinaryUpload from "@/app/components/CloudinaryUpload";
import { fabricColors, fabricTypes } from "@/data/products";

type ProductFormProps = {
  product?: {
    id: string;
    name: string;
    slug: string;
    pricePerYard: number;
    pricePerMeter: number;
    currency: string;
    type: string;
    colors: string[];
    description: string;
    images: string[];
    inStock: boolean;
    shippingProfile?: string | null;
  };
  action: (formData: FormData) => void;
};

export default function ProductForm({ product, action }: ProductFormProps) {
  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-xs uppercase text-[var(--muted)]">Name</label>
          <input
            name="name"
            defaultValue={product?.name ?? ""}
            className="input-theme mt-2 w-full rounded-full px-4 py-3 text-sm"
            required
          />
        </div>
        <div>
          <label className="text-xs uppercase text-[var(--muted)]">Slug</label>
          <input
            name="slug"
            defaultValue={product?.slug ?? ""}
            className="input-theme mt-2 w-full rounded-full px-4 py-3 text-sm"
            required
          />
        </div>
        <div>
          <label className="text-xs uppercase text-[var(--muted)]">Price per yard</label>
          <input
            name="pricePerYard"
            type="number"
            defaultValue={product?.pricePerYard ?? 0}
            className="input-theme mt-2 w-full rounded-full px-4 py-3 text-sm"
            required
          />
        </div>
        <div>
          <label className="text-xs uppercase text-[var(--muted)]">Price per meter</label>
          <input
            name="pricePerMeter"
            type="number"
            defaultValue={product?.pricePerMeter ?? 0}
            className="input-theme mt-2 w-full rounded-full px-4 py-3 text-sm"
            required
          />
        </div>
        <div>
          <label className="text-xs uppercase text-[var(--muted)]">Currency</label>
          <select
            name="currency"
            defaultValue={product?.currency ?? "JMD"}
            className="input-theme mt-2 w-full rounded-full px-4 py-3 text-sm"
          >
            <option value="JMD">JMD</option>
            <option value="USD">USD</option>
          </select>
        </div>
        <div>
          <label className="text-xs uppercase text-[var(--muted)]">Fabric type</label>
          <select
            name="type"
            defaultValue={product?.type ?? fabricTypes[0]}
            className="input-theme mt-2 w-full rounded-full px-4 py-3 text-sm"
          >
            {fabricTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs uppercase text-[var(--muted)]">
          Colors (comma separated)
        </label>
        <input
          name="colors"
          defaultValue={product?.colors.join(", ") ?? ""}
          className="input-theme mt-2 w-full rounded-full px-4 py-3 text-sm"
          placeholder={fabricColors.join(", ")}
        />
      </div>

      <div>
        <label className="text-xs uppercase text-[var(--muted)]">Description</label>
        <textarea
          name="description"
          defaultValue={product?.description ?? ""}
          className="input-theme mt-2 w-full rounded-3xl px-4 py-3 text-sm"
          rows={4}
          required
        />
      </div>

      <div>
        <label className="text-xs uppercase text-[var(--muted)]">Shipping profile</label>
        <input
          name="shippingProfile"
          defaultValue={product?.shippingProfile ?? ""}
          className="input-theme mt-2 w-full rounded-full px-4 py-3 text-sm"
          placeholder="Standard, Express, Pickup"
        />
      </div>

      <div>
        <label className="text-xs uppercase text-[var(--muted)]">Images</label>
        <CloudinaryUpload inputId="product-images" initialImages={product?.images ?? []} />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="inStock"
          defaultChecked={product?.inStock ?? true}
          className="h-4 w-4 rounded border border-theme bg-transparent"
        />
        <span className="text-sm text-[var(--muted)]">In stock</span>
      </div>

      <button className="btn-primary rounded-full px-6 py-3 text-sm font-semibold">
        Save product
      </button>
    </form>
  );
}
