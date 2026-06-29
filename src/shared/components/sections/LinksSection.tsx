import { Plus, Trash } from "lucide-react";
import Card from "../cards/Card";
import TextField from "../forms/TextField";
import IconButton from "../buttons/IconButton";

type LinksSectionProps = {
  title: string;
  links: Array<{ name: string; url: string }>;
  namePlaceholder?: string;
  urlPlaceholder?: string;
  onAddLink: () => void;
  onUpdateLink: (index: number, link: { name: string; url: string }) => void;
  onRemoveLink: (index: number) => void;
};

export default function LinksSection({
  title,
  links,
  namePlaceholder = "GitHub",
  urlPlaceholder = "https://github.com/...",
  onAddLink,
  onUpdateLink,
  onRemoveLink,
}: LinksSectionProps) {
  return (
    <Card.Section title={title}>
      <Card.Section.View>
        <ul>
          {links.map((link) => (
            <li key={link.name}>
              <p className="flex gap-2">
                <span className="font-bold">{link.name}:</span>
                <a href={link.url} target="_blank" rel="noreferrer">
                  {link.url}
                </a>
              </p>
            </li>
          ))}
        </ul>
      </Card.Section.View>

      <Card.Section.Edit>
        <div className="flex flex-col gap-2">
          {links.map((link, index) => (
            <div key={index} className="flex items-end gap-3">
              <div className="w-40">
                <TextField
                  id={`link-name-${index}`}
                  value={link.name}
                  onChange={(value) =>
                    onUpdateLink(index, { ...link, name: value })
                  }
                  type="text"
                  placeholder={namePlaceholder}
                />
              </div>
              <div className="h-9 py-1 text-text-secondary">:</div>
              <div className="flex-1">
                <TextField
                  id={`link-url-${index}`}
                  value={link.url}
                  onChange={(value) =>
                    onUpdateLink(index, { ...link, url: value })
                  }
                  type="text"
                  placeholder={urlPlaceholder}
                />
              </div>
              <div className="w-8 h-9 text-xl flex items-center justify-center">
                <IconButton
                  icon={Trash}
                  ariaLabel={`Remove ${link.name || "link"} link`}
                  onClick={() => onRemoveLink(index)}
                  defaultStyle="text-text-secondary"
                  hoverStyle="hover:bg-danger-bg hover:text-danger"
                />
              </div>
            </div>
          ))}
          <IconButton
            icon={Plus}
            text="Add Link"
            onClick={onAddLink}
            defaultStyle="text-brand-600 border border-border-subtle rounded-lg py-2 px-4"
            hoverStyle="hover:bg-layer-mantle"
          />
        </div>
      </Card.Section.Edit>
    </Card.Section>
  );
}
