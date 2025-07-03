import AvatarGroup from "@/components/ui/animated-tooltip";


export default function Tooltip () {
  return (<AvatarGroup
          items={[
            
 {
    id: 1,
    name: "Alexa Mercer",
    designation: "CEO, Vanta",
    image: "/avatar/new-image.avif",
  },
  {
    id: 2,
    name: "Brian Carter",
    designation: "CPO, Stytch",
    image: "/avatar/new-image2.avif",
  },
  {
    id: 3,
    name: "David Miller",
    designation: "CMO, Clay",
    image: "/avatar/images3.avif",
  },
  {
    id: 4,
    name: "Mark Thompson",
    designation: "CTO, Cal.com",
    image: "/avatar/images4.avif",
  },
  {
    id: 5,
    name: "Jake Reynolds",
    designation: "CFO, Levity",
    image: "/avatar/new-image3.avif",
  },
  {
    id: 6,
    name: "Kyle Anderson",
    designation: "COO, Modern Treasury",
    image: "https://randomuser.me/api/portraits/men/65.jpg",
  }
          ]}
          maxVisible={5}
          size="md"
        />)
}