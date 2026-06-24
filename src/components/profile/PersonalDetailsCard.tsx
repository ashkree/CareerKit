import { temp_profile, type Profile } from "../../types";
import {
  MapPin,
  Phone,
  Mail,
  Copy,
  CheckCheck,
  Plus,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import TextField from "../common/forms/TextField";
import IconText from "../common/IconText";
import IconButton from "../common/buttons/IconButton";
import EditableCard from "../common/cards/EditableCard";
import { RemovableBadge, Badge } from "../common/badges";
import { updateProp } from "../../utilities/data_updates";
import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import Dropdown from "../common/forms/Dropdown";
import type { DropdownOption } from "../common/forms/Dropdown";
import { invoke } from "@tauri-apps/api/core";

type PersonalLinkProps = {
  name: string;
  url: string;
};

function PersonalLink({ name, url }: PersonalLinkProps) {
  return (
    <li key={name}>
      <p className="flex gap-2">
        <span className="font-bold"> {name}:</span>
        <a href={url} target="_blank" rel="noreferrer">
          {url}
        </a>

        <IconButton
          icon={Copy}
          activeIcon={CheckCheck}
          onClick={async () => {
            await navigator.clipboard.writeText(url);
          }}
          hoverStyle="text-text-secondary hover:bg-layer-mantle hover:text-brand-600"
          activeStyle="bg-success-bg text-success border-success-border"
          ariaLabel={`Copy button for ${name} url`}
          activeDuration={1500}
        />
      </p>
    </li>
  );
}

type EditingViewProps = {
  draft: Profile;
  onChange: (next: Profile) => void;
};

function EditingView({ draft, onChange }: EditingViewProps) {
  const [newLanguage, setNewLanguage] = useState("");
  const COUNTRY_CODE_OPTIONS: DropdownOption[] = getCountries()
    .map((country) => {
      const name =
        new Intl.DisplayNames(["en"], { type: "region" }).of(country) ??
        country;
      const code = getCountryCallingCode(country);
      return { value: code, label: `${name} (+${code})` };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <form className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 border-b border-border-subtle pb-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex-1">
            <TextField
              id="firstNameField"
              label="First Name"
              value={draft.first_name}
              type="text"
              onChange={(value) => {
                onChange(updateProp(draft, "first_name", value));
              }}
              placeholder="John"
              disabled={false}
            />
          </div>
          <TextField
            id="lastNameField"
            label="Last Name"
            value={draft.last_name}
            onChange={(value) => {
              onChange(updateProp(draft, "last_name", value));
            }}
            type="text"
            placeholder="Doe"
            disabled={false}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex-1">
            <TextField
              id="cityField"
              label="City"
              value={draft.location.city}
              type="text"
              onChange={(value) => {
                onChange(
                  updateProp(
                    draft,
                    "location",
                    updateProp(draft.location, "city", value),
                  ),
                );
              }}
              helperText="The city you currently reside in"
              placeholder="Dubai"
              disabled={false}
            />
          </div>
          <TextField
            id="countryField"
            label="Country"
            value={draft.location.country}
            onChange={(value) => {
              onChange(
                updateProp(
                  draft,
                  "location",
                  updateProp(draft.location, "country", value),
                ),
              );
            }}
            type="text"
            helperText="The country you currently reside in"
            placeholder="United Arab Emirates"
            disabled={false}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 border-b border-border-subtle pb-3">
        <TextField
          id="emailField"
          label="Your Email"
          value={draft.email}
          type="email"
          placeholder="john.doe@mail.com"
          disabled={false}
          onChange={(value) => {
            onChange(updateProp(draft, "email", value));
          }}
        />
        <div className="flex gap-2 items-start">
          <Dropdown
            id="countryCode"
            label="Country Code"
            options={COUNTRY_CODE_OPTIONS}
            value={draft.phone.country_code}
            onChange={(value) => {
              onChange(
                updateProp(
                  draft,
                  "phone",
                  updateProp(draft.phone, "country_code", value),
                ),
              );
            }}
            className="min-w-56"
          />
          <div className="flex-1">
            <TextField
              id="numberField"
              label="Phone Number"
              value={draft.phone.number}
              onChange={(value) => {
                onChange(
                  updateProp(
                    draft,
                    "phone",
                    updateProp(draft.phone, "number", value),
                  ),
                );
              }}
              type="text"
              placeholder="555600480"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 border-b border-border-subtle pb-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-text-primary">
            Your Links
          </span>
          <IconButton
            icon={Plus}
            text="Add"
            onClick={() => {
              onChange(
                updateProp(draft, "links", [
                  ...draft.links,
                  { name: "", url: "" },
                ]),
              );
            }}
            defaultStyle="text-text-secondary"
            hoverStyle="hover:bg-layer-core hover:text-text-primary"
            activeStyle="bg-layer-mantle text-text-secondary"
            activeDuration={200}
          />
        </div>

        {draft.links.map((link, index) => (
          <div key={index} className="flex items-end gap-3">
            <div className="w-40">
              <TextField
                id={`link-name-${index}`}
                value={link.name}
                onChange={(value) => {
                  const updated = draft.links.map((l, i) =>
                    i === index ? { ...l, name: value } : l,
                  );
                  onChange(updateProp(draft, "links", updated));
                }}
                type="text"
                placeholder="LinkedIn"
              />
            </div>
            <div className="h-9 py-1 text-text-secondary">:</div>
            <div className="flex-1">
              <TextField
                id={`link-url-${index}`}
                value={link.url}
                onChange={(value) => {
                  const updated = draft.links.map((l, i) =>
                    i === index ? { ...l, url: value } : l,
                  );
                  onChange(updateProp(draft, "links", updated));
                }}
                type="text"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div className="w-8 h-9 text-xl flex items-center justify-center">
              <IconButton
                icon={Trash}
                ariaLabel={`Remove ${link.name || "link"} link`}
                onClick={() => {
                  onChange(
                    updateProp(
                      draft,
                      "links",
                      draft.links.filter((_, i) => i !== index),
                    ),
                  );
                }}
                defaultStyle="text-text-secondary"
                hoverStyle="hover:bg-danger-bg hover:text-danger"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 border-b border-border-subtle pb-3">
        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <TextField
              id="languageInput"
              label="Languages"
              type="text"
              placeholder="English"
              value={newLanguage}
              onChange={setNewLanguage}
            />
          </div>
          <IconButton
            icon={Plus}
            text="Add"
            onClick={() => {
              if (!newLanguage.trim()) return;
              onChange(
                updateProp(draft, "languages", [
                  ...draft.languages,
                  newLanguage.trim(),
                ]),
              );
              setNewLanguage("");
            }}
            defaultStyle="text-text-secondary"
            hoverStyle="hover:bg-layer-core hover:text-text-primary"
            activeStyle="bg-layer-mantle text-text-secondary"
            activeDuration={200}
          />
        </div>
        <ul className="flex gap-2">
          {draft.languages.map((language, index) => (
            <RemovableBadge
              name={language}
              onClick={() => {
                onChange(
                  updateProp(
                    draft,
                    "languages",
                    draft.languages.filter((_, i) => i !== index),
                  ),
                );
              }}
            />
          ))}
        </ul>
      </div>
    </form>
  );
}

type DetailsViewProps = {
  profile: Profile;
};

function DetailsView({ profile }: DetailsViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="border-b border-border-subtle pb-3">
        <h3 className="text-text-primary font-bold text-xl wrap-break-word pr-8">
          {profile.first_name} {profile.last_name}
        </h3>
        <div className="pr-8">
          <IconText
            icon={MapPin}
            text={`${profile.location.city}, ${profile.location.country}`}
          />
        </div>
      </div>
      <div className="border-b border-border-subtle pb-3">
        <h3 className="text-text-secondary font-bold text-md pb-2">
          Your Contact Details
        </h3>
        <IconText icon={Mail} text={`${profile.email}`} />
        <IconText
          icon={Phone}
          text={`+${profile.phone.country_code} - ${profile.phone.number}`}
        />
      </div>
      <div className="border-b border-border-subtle pb-3">
        <h3 className="text-text-secondary font-bold text-md pb-2">
          Your Links
        </h3>
        <ul>
          {profile.links.map((link) => (
            <PersonalLink name={link.name} url={link.url} />
          ))}
        </ul>
      </div>
      <div className="border-b border-border-subtle pb-3">
        <h3 className="text-text-secondary font-bold text-md pb-3">
          Your Languages
        </h3>
        <ul className="flex gap-2">
          {profile.languages.map((language) => (
            <Badge name={language} />
          ))}
        </ul>
      </div>
    </div>
  );
}

async function getProfile() {
  return await invoke<Profile | null>("get_profile");
}

async function upsertProfile(profile: Profile) {
  return await invoke<void>("upsert_profile", { profile });
}

export default function PersonalDetailsCard() {
  const [savedProfile, setSavedProfile] = useState<Profile>(temp_profile);
  const [draft, setDraft] = useState<Profile>(temp_profile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getProfile();
        const initialProfile = profile ?? temp_profile;

        setSavedProfile(initialProfile);
        setDraft(initialProfile);
      } catch (err) {
        console.error(err);

        setSavedProfile(temp_profile);
        setDraft(temp_profile);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSave() {
    await upsertProfile(draft);
    setSavedProfile(draft);
  }

  function handleCancel() {
    setDraft(savedProfile);
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <EditableCard
      view={() => <DetailsView profile={savedProfile} />}
      edit={() => <EditingView draft={draft} onChange={setDraft} />}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
