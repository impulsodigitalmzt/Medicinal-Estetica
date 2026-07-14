"use client";



import { useState } from "react";

import Image from "next/image";

import Link from "next/link";

import PageHeader from "@/components/PageHeader";

import BrandSlider from "@/components/BrandSlider";

import SubpageLayout from "@/components/SubpageLayout";

import { StaggerGrid, StaggerItem } from "@/components/StaggerReveal";

import { PRODUCTS, CLINIC, formatPriceMXN, type Product } from "@/lib/data";



const CATEGORIES = [

  "Todos",

  "Limpiadores",

  "Sueros",

  "Hidratación",

  "Protectores Solares",

  "Anti-edad",

] as const;



type Category = (typeof CATEGORIES)[number];



function ProductCard({ product }: { product: Product }) {
  const [imgSrc, setImgSrc] = useState(product.image);
  const fallback =
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&h=450&q=80";

  return (
    <article className="card-serenity flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden bg-luxury-card">
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          onError={() => {
            if (imgSrc !== fallback) setImgSrc(fallback);
          }}
        />
      </div>

      <div className="flex flex-1 flex-col p-6">

        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-luxury-accent">

          {product.brand}

        </p>

        <h3 className="mt-1 line-clamp-2 font-serif text-lg text-luxury-dark">{product.name}</h3>

        <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-luxury-text/60">

          {product.category}

        </p>

        <p className="mt-4 font-serif text-xl text-luxury-dark">

          {formatPriceMXN(product.price)}

        </p>

        <p className="mt-1 text-xs text-luxury-text/50">Precio de referencia</p>

      </div>

    </article>

  );

}



export default function TiendaPage() {

  const [filter, setFilter] = useState<Category>("Todos");



  const filtered =

    filter === "Todos"

      ? PRODUCTS

      : PRODUCTS.filter((p) => p.category === filter);



  return (

    <SubpageLayout showBrandSlider={false}>

      <PageHeader
        label="Skincare premium"
        title="Catálogo de productos dermatológicos"
        description={CLINIC.copy.storeDescription}
      />



      <BrandSlider />



      <section className="section-padding bg-luxury-bg">

        <div className="luxury-container">

          <div className="mb-10 flex flex-wrap justify-center gap-2">

            {CATEGORIES.map((cat) => (

              <button

                key={cat}

                type="button"

                onClick={() => setFilter(cat)}

                className={`rounded-pill px-4 py-2 text-xs font-medium transition-all duration-300 sm:px-5 sm:py-2.5 sm:text-sm ${

                  filter === cat

                    ? "bg-luxury-dark text-luxury-bg shadow-serenity"

                    : "glass-luxury text-luxury-text hover:border-luxury-accent/40"

                }`}

              >

                {cat}

              </button>

            ))}

          </div>



          <StaggerGrid

            key={filter}

            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"

          >

            {filtered.map((product) => (

              <StaggerItem key={product.id}>

                <ProductCard product={product} />

              </StaggerItem>

            ))}

          </StaggerGrid>



          <div className="mt-14 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">

            <Link href="/reservar" className="btn-luxury-gold">

              Agendar consulta

            </Link>

            <Link href="/servicios" className="btn-pill-outline">

              Ver tratamientos en clínica

            </Link>

          </div>

        </div>

      </section>

    </SubpageLayout>

  );

}


