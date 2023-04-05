<?php
namespace App\Form;

use App\Entity\FermeGeom;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class AddEtabFermeFinType extends AbstractType{

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            
            ->add('acces_handicape', CheckboxType::class)
            ->add('acces_handicap_auditif', CheckboxType::class)
            ->add('acces_handicap_mental', CheckboxType::class)
            ->add('acces_handicap_motrice', CheckboxType::class)
            ->add('acces_handicap_visuel', CheckboxType::class)
            ->add('acces_voiture', CheckboxType::class)
            ->add('adherent_adeve', CheckboxType::class)
            ->add('agriculture_bio', CheckboxType::class)
            ->add('animaux_autoriser', CheckboxType::class)
            ->add('atelier', CheckboxType::class)
            ->add('carte_bancaire', CheckboxType::class)
            ->add('cheque_vacance', CheckboxType::class)
            ->add('degustation', CheckboxType::class)
            ->add('marcher_produit', CheckboxType::class)
            ->add('site_web', CheckboxType::class)
            ->add('station_verte', CheckboxType::class)
            ->add('tickets_restaurant', CheckboxType::class)
            ->add('vente_en_ligne', CheckboxType::class);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => FermeGeom::class,
        ]);
    }
}