import { Link } from "@tanstack/solid-router";
import type { Component } from "solid-js";
import { For } from "solid-js";
import { ArrowCircleRight } from "~/components/icons/Phosphor";

// Define the shape of the data this component expects
export interface DynastyData {
  id: string;
  slug: string;
  dynasty: string;
  period: string;
  startYear: number;
  endYear: number;
  description: string;
  takeaways: string[];
  imageUrl: string;
}

interface CeramicStoryCardProps {
  data: DynastyData;
}

export const CeramicStoryCard: Component<CeramicStoryCardProps> = (props) => {
  return (
    <div class="bg-white rounded-lg shadow-xl overflow-hidden flex flex-col md:flex-row max-w-4xl mx-auto">
      {/* Left Side: Image */}
      <div class="w-full md:w-1/3 flex-shrink-0">
        <img
          src={props.data.imageUrl}
          alt={`Ceramics from the ${props.data.dynasty} dynasty`}
          class="object-cover w-full h-full"
          onerror="this.onerror=null;this.src='https://placehold.co/400x600/E2E8F0/4A5568?text=Image';"
        />
      </div>

      {/* Right Side: Text Content */}
      <div class="p-8 flex flex-col">
        {/* Header Section */}
        <div class="mb-4">
          <div class="flex items-baseline space-x-4">
            <h2 class="text-4xl font-bold text-gray-800">
              {props.data.dynasty}
            </h2>
            <p class="text-lg text-gray-500">{props.data.period}</p>
          </div>
          <div class="flex items-center space-x-6 mt-1 text-sm text-gray-600">
            <span>
              Start: <strong>{props.data.startYear}</strong>
            </span>
            <span>
              End: <strong>{props.data.endYear}</strong>
            </span>
          </div>
        </div>

        {/* Description */}
        <p class="text-gray-700 leading-relaxed mb-6">
          {props.data.description}
        </p>

        {/* Takeaways */}
        <div class="mt-auto">
          <h3 class="font-semibold text-gray-800 mb-2">Key Takeaways:</h3>
          <ul class="space-y-2 list-disc list-inside text-gray-600">
            <For each={props.data.takeaways}>{(item) => <li>{item}</li>}</For>
          </ul>
        </div>

        {/* Link to Full Article */}
        <div class="mt-8 text-right">
          <Link
            to="/ceramicstory/$slug"
            params={{ slug: props.data.slug }}
            class="inline-flex items-center font-semibold text-blue-600 hover:text-blue-800 transition-colors group"
          >
            Read Full Article
            <ArrowCircleRight
              size={20}
              class="ml-1 group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};
