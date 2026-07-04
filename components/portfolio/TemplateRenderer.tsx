"use client";

import React from "react";
import { PortfolioData, PortfolioSettings } from "@/lib/portfolio-defaults";
import SleekDarkTemplate from "./SleekDarkTemplate";
import CreativeGreenTemplate from "./CreativeGreenTemplate";
import RetroTerminalTemplate from "./RetroTerminalTemplate";
import GlassCreativeTemplate from "./GlassCreativeTemplate";
import ArchitectTemplate from "./ArchitectTemplate";
import EngineeringSleekTemplate from "./EngineeringSleekTemplate";

interface TemplateRendererProps {
  templateId: string;
  data: PortfolioData;
  settings: PortfolioSettings;
}

export default function TemplateRenderer({ templateId, data, settings }: TemplateRendererProps) {
  switch (templateId) {
    case 'sleek-dark':
      return <SleekDarkTemplate data={data} settings={settings} />;
    case 'creative-green':
      return <CreativeGreenTemplate data={data} settings={settings} />;
    case 'retro-terminal':
      return <RetroTerminalTemplate data={data} settings={settings} />;
    case 'glass-creative':
      return <GlassCreativeTemplate data={data} settings={settings} />;
    case 'architect-prismatic':
      return <ArchitectTemplate data={data} settings={settings} />;
    case 'engineering-sleek':
      return <EngineeringSleekTemplate data={data} settings={settings} />;
    default:
      return <SleekDarkTemplate data={data} settings={settings} />;
  }
}
