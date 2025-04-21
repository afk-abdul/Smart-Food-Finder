export const restaurants = [
  {
    id: "1",
    name: "Taste of Tokyo",
    cuisine: "Japanese",
    rating: 4.8,
    reviewCount: 342,
    priceRange: "$",
    distance: "1.2 miles away",
    image: "https://foodish-api.herokuapp.com/images/japanese/japanese1.jpg",
    isNew: true,
    tags: ["Sushi", "Ramen", "Outdoor Seating"],
    address: "123 Main St, Cityville",
    phone: "(555) 123-4567",
    website: "https://tasteoftokyo.example.com",
    openingHours: "11:00 AM - 10:00 PM",
    description:
      "Authentic Japanese cuisine featuring fresh sushi, ramen, and traditional dishes in a modern setting with a zen garden patio.",
    menu: [
      {
        name: "Dragon Roll",
        price: 16.99,
        description: "Eel, avocado, cucumber topped with thinly sliced avocado",
        image: "https://foodish-api.herokuapp.com/images/sushi/sushi1.jpg",
      },
      {
        name: "Tonkotsu Ramen",
        price: 14.99,
        description:
          "Rich pork bone broth, chashu pork, soft boiled egg, green onions",
        image: "https://foodish-api.herokuapp.com/images/ramen/ramen1.jpg",
      },
      {
        name: "Chicken Teriyaki",
        price: 18.99,
        description:
          "Grilled chicken with house-made teriyaki sauce, served with rice and vegetables",
        image:
          "https://foodish-api.herokuapp.com/images/teriyaki/teriyaki1.jpg",
      },
      {
        name: "Vegetable Tempura",
        price: 12.99,
        description: "Assorted seasonal vegetables in a light, crispy batter",
        image: "https://foodish-api.herokuapp.com/images/tempura/tempura1.jpg",
      },
    ],
    reviews: [
      {
        name: "Sarah L.",
        rating: 5,
        comment:
          "Best sushi in town! The dragon roll is a must-try. Service was excellent and the atmosphere is perfect for date night.",
        date: "2 days ago",
      },
      {
        name: "Michael T.",
        rating: 4,
        comment:
          "Great food but a bit pricey. The ramen was authentic and delicious. Will definitely come back.",
        date: "1 week ago",
      },
      {
        name: "Jessica R.",
        rating: 5,
        comment:
          "Amazing experience! The chef's special was incredible and the staff was very attentive.",
        date: "2 weeks ago",
      },
    ],
    hours: [
      { day: "Monday", time: "11:00 AM - 9:00 PM" },
      { day: "Tuesday", time: "11:00 AM - 9:00 PM" },
      { day: "Wednesday", time: "11:00 AM - 9:00 PM" },
      { day: "Thursday", time: "11:00 AM - 9:00 PM" },
      { day: "Friday", time: "11:00 AM - 10:00 PM" },
      { day: "Saturday", time: "12:00 PM - 10:00 PM" },
      { day: "Sunday", time: "12:00 PM - 8:00 PM" },
    ],
  },
  {
    id: "2",
    name: "Bella Italia",
    cuisine: "Italian",
    rating: 4.6,
    reviewCount: 287,
    priceRange: "$$",
    distance: "0.8 miles away",
    image: "https://foodish-api.herokuapp.com/images/italian/italian1.jpg",
    isNew: false,
    tags: ["Pizza", "Pasta", "Wine Bar"],
    address: "456 Oak Ave, Cityville",
    phone: "(555) 234-5678",
    website: "https://bellaitalia.example.com",
    openingHours: "12:00 PM - 11:00 PM",
    description:
      "Family-owned Italian restaurant serving traditional recipes passed down through generations. Known for wood-fired pizzas and homemade pasta.",
    menu: [
      {
        name: "Margherita Pizza",
        price: 15.99,
        description: "San Marzano tomatoes, fresh mozzarella, basil, olive oil",
        image: "https://foodish-api.herokuapp.com/images/pizza/pizza1.jpg",
      },
      {
        name: "Fettuccine Alfredo",
        price: 17.99,
        description: "Homemade fettuccine with creamy parmesan sauce",
        image: "https://foodish-api.herokuapp.com/images/pasta/pasta1.jpg",
      },
      {
        name: "Osso Buco",
        price: 26.99,
        description:
          "Braised veal shanks with gremolata, served with risotto Milanese",
        image:
          "https://foodish-api.herokuapp.com/images/osso-buco/osso-buco1.jpg",
      },
      {
        name: "Tiramisu",
        price: 8.99,
        description:
          "Classic Italian dessert with espresso-soaked ladyfingers and mascarpone cream",
        image: "https://foodish-api.herokuapp.com/images/dessert/dessert1.jpg",
      },
    ],
    reviews: [
      {
        name: "Robert J.",
        rating: 5,
        comment:
          "Authentic Italian food that reminds me of my trip to Rome. The pasta is made fresh daily and you can taste the difference!",
        date: "3 days ago",
      },
      {
        name: "Amanda P.",
        rating: 4,
        comment:
          "Great atmosphere and delicious food. The service was a bit slow but worth the wait.",
        date: "1 week ago",
      },
      {
        name: "David M.",
        rating: 5,
        comment:
          "The wine selection is impressive and pairs perfectly with their dishes. Highly recommend the osso buco!",
        date: "3 weeks ago",
      },
    ],
    hours: [
      { day: "Monday", time: "Closed" },
      { day: "Tuesday", time: "12:00 PM - 10:00 PM" },
      { day: "Wednesday", time: "12:00 PM - 10:00 PM" },
      { day: "Thursday", time: "12:00 PM - 10:00 PM" },
      { day: "Friday", time: "12:00 PM - 11:00 PM" },
      { day: "Saturday", time: "12:00 PM - 11:00 PM" },
      { day: "Sunday", time: "1:00 PM - 9:00 PM" },
    ],
  },
  {
    id: "3",
    name: "La Pizzeria",
    cuisine: "Italian",
    rating: 4.5,
    reviewCount: 215,
    priceRange: "$$",
    distance: "2.3 miles away",
    image: "https://foodish-api.herokuapp.com/images/italian/italian2.jpg",
    isNew: false,
    tags: ["Pizza", "Pasta", "Family Friendly"],
    address: "789 Pine St, Cityville",
    phone: "(555) 345-6789",
    website: "https://lapizzeria.example.com",
    openingHours: "11:00 AM - 10:00 PM",
    description:
      "Classic Italian pizzeria offering delicious pizzas, fresh pasta, and hearty salads in a cozy, family-friendly environment.",
    menu: [
      {
        name: "Margherita Pizza",
        price: 13.99,
        description: "Fresh mozzarella, basil, and tomato sauce",
        image: "https://foodish-api.herokuapp.com/images/pizza/pizza2.jpg",
      },
      {
        name: "Lasagna",
        price: 18.99,
        description:
          "Layers of pasta, beef, ricotta, and marinara sauce, topped with melted mozzarella",
        image: "https://foodish-api.herokuapp.com/images/pasta/pasta2.jpg",
      },
      {
        name: "Caprese Salad",
        price: 9.99,
        description:
          "Fresh mozzarella, tomatoes, basil, olive oil, balsamic reduction",
        image: "https://foodish-api.herokuapp.com/images/salad/salad1.jpg",
      },
    ],
    reviews: [
      {
        name: "Emily D.",
        rating: 4,
        comment:
          "The pizza is fantastic! Loved the crispy crust and fresh ingredients. Service was a bit slow, but we had a good time.",
        date: "5 days ago",
      },
      {
        name: "John W.",
        rating: 5,
        comment:
          "La Pizzeria never disappoints. Always a family favorite with great pizza and pasta.",
        date: "2 weeks ago",
      },
    ],
    hours: [
      { day: "Monday", time: "11:00 AM - 9:00 PM" },
      { day: "Tuesday", time: "11:00 AM - 9:00 PM" },
      { day: "Wednesday", time: "11:00 AM - 9:00 PM" },
      { day: "Thursday", time: "11:00 AM - 9:00 PM" },
      { day: "Friday", time: "11:00 AM - 10:00 PM" },
      { day: "Saturday", time: "12:00 PM - 10:00 PM" },
      { day: "Sunday", time: "12:00 PM - 8:00 PM" },
    ],
  },
  {
    id: "4",
    name: "Taco Town",
    cuisine: "Mexican",
    rating: 4.7,
    reviewCount: 389,
    priceRange: "$",
    distance: "0.5 miles away",
    image: "https://foodish-api.herokuapp.com/images/mexican/mexican1.jpg",
    isNew: true,
    tags: ["Tacos", "Burritos", "Casual"],
    address: "321 Elm St, Cityville",
    phone: "(555) 456-7890",
    website: "https://tacotown.example.com",
    openingHours: "10:00 AM - 9:00 PM",
    description:
      "Vibrant Mexican eatery serving flavorful tacos, burritos, and quesadillas with a variety of salsas and toppings.",
    menu: [
      {
        name: "Beef Taco",
        price: 3.99,
        description: "Seasoned beef, lettuce, cheese, salsa",
        image: "https://foodish-api.herokuapp.com/images/taco/taco1.jpg",
      },
      {
        name: "Chicken Burrito",
        price: 8.99,
        description:
          "Grilled chicken, rice, beans, guacamole, salsa wrapped in a flour tortilla",
        image: "https://foodish-api.herokuapp.com/images/burrito/burrito1.jpg",
      },
      {
        name: "Quesadilla",
        price: 6.99,
        description:
          "Grilled flour tortilla with melted cheese and choice of protein",
        image:
          "https://foodish-api.herokuapp.com/images/quesadilla/quesadilla1.jpg",
      },
    ],
    reviews: [
      {
        name: "Liam G.",
        rating: 5,
        comment:
          "Best tacos in the city! Love the variety of salsas they offer.",
        date: "3 days ago",
      },
      {
        name: "Olivia H.",
        rating: 4,
        comment:
          "Great burritos and casual vibe. The only downside is the limited seating.",
        date: "1 week ago",
      },
    ],
    hours: [
      { day: "Monday", time: "10:00 AM - 9:00 PM" },
      { day: "Tuesday", time: "10:00 AM - 9:00 PM" },
      { day: "Wednesday", time: "10:00 AM - 9:00 PM" },
      { day: "Thursday", time: "10:00 AM - 9:00 PM" },
      { day: "Friday", time: "10:00 AM - 10:00 PM" },
      { day: "Saturday", time: "11:00 AM - 10:00 PM" },
      { day: "Sunday", time: "11:00 AM - 8:00 PM" },
    ],
  },
  {
    id: "5",
    name: "Curry House",
    cuisine: "Indian",
    rating: 4.9,
    reviewCount: 276,
    priceRange: "$$",
    distance: "1.5 miles away",
    image: "https://foodish-api.herokuapp.com/images/indian/indian1.jpg",
    isNew: true,
    tags: ["Curry", "Naan", "Spicy"],
    address: "123 Spice Rd, Cityville",
    phone: "(555) 567-8901",
    website: "https://curryhouse.example.com",
    openingHours: "11:00 AM - 10:00 PM",
    description:
      "Authentic Indian cuisine with a variety of curry dishes, naan, and traditional desserts, all prepared with fresh, aromatic spices.",
    menu: [
      {
        name: "Butter Chicken",
        price: 14.99,
        description: "Tender chicken in a creamy, spiced tomato sauce",
        image: "https://foodish-api.herokuapp.com/images/curry/curry1.jpg",
      },
      {
        name: "Lamb Rogan Josh",
        price: 18.99,
        description: "Slow-cooked lamb in a rich and aromatic curry sauce",
        image: "https://foodish-api.herokuapp.com/images/curry/curry2.jpg",
      },
      {
        name: "Garlic Naan",
        price: 3.99,
        description: "Soft, fluffy naan with garlic and butter",
        image: "https://foodish-api.herokuapp.com/images/naan/naan1.jpg",
      },
    ],
    reviews: [
      {
        name: "Daniel F.",
        rating: 5,
        comment:
          "Incredible flavors! The butter chicken is my favorite. So creamy and comforting.",
        date: "1 week ago",
      },
      {
        name: "Sophie A.",
        rating: 5,
        comment:
          "Hands down the best Indian food in the city. Highly recommend the lamb rogan josh.",
        date: "2 weeks ago",
      },
    ],
    hours: [
      { day: "Monday", time: "11:00 AM - 9:00 PM" },
      { day: "Tuesday", time: "11:00 AM - 9:00 PM" },
      { day: "Wednesday", time: "11:00 AM - 9:00 PM" },
      { day: "Thursday", time: "11:00 AM - 9:00 PM" },
      { day: "Friday", time: "11:00 AM - 10:00 PM" },
      { day: "Saturday", time: "12:00 PM - 10:00 PM" },
      { day: "Sunday", time: "12:00 PM - 8:00 PM" },
    ],
  },
  {
    id: "6",
    name: "The Burger Joint",
    cuisine: "American",
    rating: 4.4,
    reviewCount: 329,
    priceRange: "$",
    distance: "1.0 mile away",
    image: "https://foodish-api.herokuapp.com/images/burger/burger1.jpg",
    isNew: false,
    tags: ["Burgers", "Fries", "Casual"],
    address: "567 Burger St, Cityville",
    phone: "(555) 678-9012",
    website: "https://theburgerjoint.example.com",
    openingHours: "11:00 AM - 11:00 PM",
    description:
      "Classic American burgers, fries, and milkshakes served in a laid-back, retro diner atmosphere.",
    menu: [
      {
        name: "Cheeseburger",
        price: 8.99,
        description:
          "Juicy beef patty, cheddar cheese, lettuce, tomato, pickles, and special sauce",
        image: "https://foodish-api.herokuapp.com/images/burger/burger2.jpg",
      },
      {
        name: "Veggie Burger",
        price: 9.99,
        description:
          "Grilled veggie patty with lettuce, tomato, pickles, and vegan mayo",
        image: "https://foodish-api.herokuapp.com/images/burger/burger3.jpg",
      },
      {
        name: "Fries",
        price: 3.99,
        description: "Crispy golden fries with a side of ketchup",
        image: "https://foodish-api.herokuapp.com/images/fries/fries1.jpg",
      },
    ],
    reviews: [
      {
        name: "Mark W.",
        rating: 4,
        comment:
          "Good burgers, but the veggie burger could use more flavor. Great service though!",
        date: "4 days ago",
      },
      {
        name: "Cathy S.",
        rating: 5,
        comment:
          "The best cheeseburger I’ve ever had. Their milkshakes are a perfect finish!",
        date: "1 week ago",
      },
    ],
    hours: [
      { day: "Monday", time: "11:00 AM - 10:00 PM" },
      { day: "Tuesday", time: "11:00 AM - 10:00 PM" },
      { day: "Wednesday", time: "11:00 AM - 10:00 PM" },
      { day: "Thursday", time: "11:00 AM - 10:00 PM" },
      { day: "Friday", time: "11:00 AM - 11:00 PM" },
      { day: "Saturday", time: "12:00 PM - 11:00 PM" },
      { day: "Sunday", time: "12:00 PM - 8:00 PM" },
    ],
  },
  {
    id: "7",
    name: "Spicy Hut",
    cuisine: "Indian",
    rating: 4.3,
    reviewCount: 211,
    priceRange: "$$",
    distance: "2.0 miles away",
    image: "https://foodish-api.herokuapp.com/images/indian/indian2.jpg",
    isNew: true,
    tags: ["Curry", "Biryani", "Spicy"],
    address: "987 Curry Rd, Cityville",
    phone: "(555) 789-0123",
    website: "https://spicyhut.example.com",
    openingHours: "11:00 AM - 10:00 PM",
    description:
      "Bold, flavorful Indian dishes, including spicy curries, biryanis, and fresh naan bread.",
    menu: [
      {
        name: "Chicken Biryani",
        price: 15.99,
        description: "Fragrant rice, tender chicken, and aromatic spices",
        image: "https://foodish-api.herokuapp.com/images/biryani/biryani1.jpg",
      },
      {
        name: "Paneer Tikka",
        price: 12.99,
        description:
          "Marinated paneer grilled to perfection, served with mint chutney",
        image: "https://foodish-api.herokuapp.com/images/tikka/tikka1.jpg",
      },
      {
        name: "Spicy Lamb Curry",
        price: 17.99,
        description: "Lamb cooked in a rich and spicy curry sauce",
        image: "https://foodish-api.herokuapp.com/images/curry/curry3.jpg",
      },
    ],
    reviews: [
      {
        name: "Lucas G.",
        rating: 5,
        comment:
          "Incredible flavors! The biryani was amazing and perfectly spiced. Highly recommend!",
        date: "2 days ago",
      },
      {
        name: "Sophia M.",
        rating: 4,
        comment:
          "The curry was very spicy, but the flavor was out of this world. Great food overall!",
        date: "1 week ago",
      },
    ],
    hours: [
      { day: "Monday", time: "11:00 AM - 9:00 PM" },
      { day: "Tuesday", time: "11:00 AM - 9:00 PM" },
      { day: "Wednesday", time: "11:00 AM - 9:00 PM" },
      { day: "Thursday", time: "11:00 AM - 9:00 PM" },
      { day: "Friday", time: "11:00 AM - 10:00 PM" },
      { day: "Saturday", time: "12:00 PM - 10:00 PM" },
      { day: "Sunday", time: "12:00 PM - 8:00 PM" },
    ],
  },
];
