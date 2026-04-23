import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  computed,
  inject,
  signal
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import { FAQS } from '../store/data/faqs';
import { CartService } from '../store/services/cart.service';
import { SiteFooterComponent } from '../../shared/components/site-footer/site-footer.component';
import { SiteHeaderComponent } from '../../shared/components/site-header/site-header.component';

export interface Product {
  id: number;
  name: string;
  desc: string;
  category: 'Electrical Services' | 'Plumbing Services' | 'Deep Cleaning Services';
  image: string;
}

export interface CartItem extends Product {
  qty: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

type FilterCategory = 'All' | Product['category'];

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'AC Maintenance Service',
    desc: 'Complete AC inspection, filter cleaning, gas level check, and performance optimization to ensure efficient cooling and longer system life.',
    category: 'Electrical Services',
    image: 'assets/images/ac.png'
  },
  {
    id: 2,
    name: 'Ducting Work & FCU Installation',
    desc: 'Professional duct installation and Fan Coil Unit (FCU) setup with proper airflow design, insulation, and system balancing for optimal performance.',
    category: 'Electrical Services',
    image: 'assets/images/duct.jpg'
  },
  {
    id: 3,
    name: 'Plumbing Repair Service',
    desc: 'Leak fixing, pipe repair, and fixture maintenance services delivered with precision to ensure smooth and reliable water flow systems.',
    category: 'Plumbing Services',
    image: 'assets/images/plumbing.jpg'
  },
  {
    id: 4,
    name: 'Plastering and Painting Service',
    desc: 'High-quality wall finishing, crack repair, and professional painting services for a smooth, durable, and clean aesthetic.',
    category: 'Plumbing Services',
    image: 'assets/images/painting.jpg'
  },
  {
    id: 5,
    name: 'Tile & Block Work Service',
    desc: 'Expert tile fixing and block work services ensuring proper alignment, durability, and clean finishing for floors and walls.',
    category: 'Plumbing Services',
    image: 'assets/images/tiles.jpg'
  },
  {
    id: 6,
    name: 'Deep Cleaning Service',
    desc: 'Comprehensive deep cleaning covering kitchens, bathrooms, floors, and hard-to-reach areas using professional equipment and safe chemicals.',
    category: 'Deep Cleaning Services',
    image: 'assets/images/cleaning.jpg'
  }
];

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    SiteFooterComponent,
    SiteHeaderComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements AfterViewInit {
  private readonly route = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);
  private readonly cartService = inject(CartService);
  private readonly destroyRef = inject(DestroyRef);

  // ✅ YOUR WHATSAPP NUMBER (CORRECT FORMAT)
  private readonly whatsappNumber = '971525058712';

  private readonly countdownTarget = (() => {
    const target = new Date();
    target.setDate(target.getDate() + 3);
    return target;
  })();

  readonly filters: FilterCategory[] = [
    'All',
    'Electrical Services',
    'Plumbing Services',
    'Deep Cleaning Services'
  ];

  readonly faqs: FaqItem[] = FAQS;
  readonly products = PRODUCTS;
  readonly selectedFilter = signal<FilterCategory>('All');
  readonly isCartOpen = signal(false);
  readonly isProductModalOpen = signal(false);
  readonly isOrderModalOpen = signal(false);
  readonly toastMessage = signal('');
  readonly countdown = signal(this.createCountdown());
  readonly expandedFaq = signal<number | null>(0);
  readonly selectedProduct = signal<Product | null>(null);
  readonly selectedQuantity = signal(1);

  readonly filteredProducts = computed(() => {
    const filter = this.selectedFilter();
    return filter === 'All'
      ? this.products
      : this.products.filter((product) => product.category === filter);
  });

  readonly cartItems = this.cartService.cart;
  readonly cartCount = this.cartService.itemCount;
  readonly cartTotal = this.cartService.total;

  readonly orderForm = this.formBuilder.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    address: ['', Validators.required],
    whatsappNumber: ['', Validators.required],
    notes: ['']
  });

  constructor() {
    interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.countdown.set(this.createCountdown()));
  }

  ngAfterViewInit(): void {
    this.route.data.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
      const sectionId = data['sectionId'] as string | undefined;
      if (!sectionId) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 80);
    });
  }

  setFilter(filter: FilterCategory): void {
    this.selectedFilter.set(filter);
  }

  openProduct(product: Product): void {
    this.selectedProduct.set(product);
    this.selectedQuantity.set(1);
    this.isProductModalOpen.set(true);
  }

  closeProductModal(): void {
    this.isProductModalOpen.set(false);
    this.selectedProduct.set(null);
  }




  changeSelectedQuantity(delta: number): void {
    this.selectedQuantity.update((qty) => Math.max(1, qty + delta));
  }

  updateCartQuantity(item: CartItem, delta: number): void {
    this.cartService.updateQuantity(item.id, delta);
  }



  toggleFaq(index: number): void {
    this.expandedFaq.update((current) => (current === index ? null : index));
  }

  openCheckout(): void {
    this.isOrderModalOpen.set(true);
  }

  closeCheckout(): void {
    this.isOrderModalOpen.set(false);
  }

  placeOrder(): void {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    const value = this.orderForm.getRawValue();

    const notes = value.notes ? `%0ANotes: ${encodeURIComponent(value.notes)}` : '';

    const message =
      `Hello, I would like to place an order.%0A%0A` +
      `Name: ${encodeURIComponent(value.firstName)} ${encodeURIComponent(value.lastName)}` +
      `%0AAddress: ${encodeURIComponent(value.address)}` +
      `%0AWhatsApp: ${encodeURIComponent(value.whatsappNumber)}` +
      
      notes;

    // ✅ MOBILE + DESKTOP SUPPORT
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const url = isMobile
      ? `whatsapp://send?phone=${this.whatsappNumber}&text=${message}`
      : `https://wa.me/${this.whatsappNumber}?text=${message}`;

    window.open(url, '_blank');

    this.cartService.clear();
    this.orderForm.reset();
    this.isOrderModalOpen.set(false);
    this.isCartOpen.set(false);
    this.showToast('WhatsApp opened with your order');
  }

  private showToast(message: string): void {
    this.toastMessage.set(message);
    window.setTimeout(() => this.toastMessage.set(''), 2200);
  }

  private createCountdown(): string[] {
    const diff = Math.max(this.countdownTarget.getTime() - Date.now(), 0);

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    return [
      `${days.toString().padStart(2, '0')}d`,
      `${hours.toString().padStart(2, '0')}h`,
      `${minutes.toString().padStart(2, '0')}m`,
      `${seconds.toString().padStart(2, '0')}s`
    ];
  }
}